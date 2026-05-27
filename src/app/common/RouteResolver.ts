import {
	blue,
	blueBright,
	bold,
	cyan,
	gray,
	green,
	magenta,
	red,
	yellow,
} from "colorette";
import type { Application } from "express";
import { match } from "path-to-regexp";
import { Logging } from "@/logs";
import { SetAppRoutes } from "@/utils/helpers";

type RouteMethods = string[];
type Middlewares = string[];

interface Endpoint {
	path: string;
	methods: RouteMethods;
	middlewares: Middlewares;
}

export class RouteResolver {
	static mappedRoutes: Array<{ path: string; handler: any }> = [];
	static dynamicRoutes: { [route: string]: string[] } = {};
	static matchRoute(
		path: string,
	): { methods: string[]; params?: Record<string, string> } | null {
		for (const [route, methods] of Object.entries(
			RouteResolver.dynamicRoutes,
		)) {
			const matcher = match<Record<string, string>>(route, {
				decode: decodeURIComponent,
			});
			const result = matcher(path);
			if (result) {
				return { methods, params: result.params };
			}
		}
		return null;
	}
	static Mapper(
		AppServer: Application,
		options: { listEndpoints: boolean; onlyPaths?: boolean } = {
			listEndpoints: false,
			onlyPaths: false,
		},
	) {
		RouteResolver.prototype.getEndpoints(AppServer).forEach((endpoint) => {
			if (endpoint.path.includes(":")) {
				RouteResolver.dynamicRoutes[endpoint.path] = endpoint.methods;
			} else {
				SetAppRoutes.set(endpoint.path, endpoint.methods);
			}

			const method = endpoint.methods[0] || "";
			const methodLabel = (() => {
				switch (method) {
					case "GET":
						return bold(green(" GET    "));
					case "POST":
						return bold(yellow(" POST   "));
					case "PUT":
						return bold(blue(" PUT    "));
					case "PATCH":
						return bold(magenta(" PATCH  "));
					case "DELETE":
						return bold(red(" DELETE "));
					case "OPTIONS":
						return bold(cyan(" OPTIONS"));
					case "HEAD":
						return bold(gray(" HEAD   "));
					case "ALL":
						return bold(blueBright(" ALL    "));
					default:
						return bold(yellow(` ${method.padEnd(7)}`));
				}
			})();

			const str = `${methodLabel} ${cyan(endpoint.middlewares.join(", "))} ${gray("-")} ${blueBright(endpoint.path)}`;

			if (options.listEndpoints) {
				Logging.dev(str);
			}
		});

		// AppServer._router.stack.forEach(this.print.bind([]))
	}
	private getRouteMethods(route: any): RouteMethods {
		let methods = Object.keys(route.methods);

		methods = methods.filter((method) => method !== "_all");
		methods = methods.map((method) => method.toUpperCase());

		return methods;
	}
	private getRouteMiddlewares(route: any): Middlewares {
		return route.stack.map((item: any) => {
			const fn = item.handle;
			if (fn.name && fn.name !== "anonymous") return fn.name;
			if (fn._name) return fn._name;
			const fnStr = fn.toString();
			const m = fnStr.match(/^(?:async\s+)?(\w+)\s*\(/);
			if (m && m[1] !== "function") return m[1];
			return "handler";
		});
	}

	/**
	 * Discovers the mount prefix of a sub-router layer by probing its matcher
	 * with paths from its inner routes. Express 5 doesn't expose the path string.
	 */
	private discoverLayerPrefix(layer: any): string {
		// If it's a root mount (slash === true), no prefix
		if (layer.slash) return "";

		// Get the first route path from the sub-router to use as a probe
		const innerStack = layer.handle?.stack;
		if (!innerStack?.length) return "";

		// Find a route inside to use for probing
		let probeSuffix = "/probe";
		for (const inner of innerStack) {
			if (inner.route?.path) {
				probeSuffix = inner.route.path;
				break;
			}
		}

		// Try matching common API prefixes + the known inner path
		const commonPrefixes = [
			"/api/v1",
			"/api/v2",
			"/api",
			"/auth",
			"/admin",
			"/ws",
		];
		for (const prefix of commonPrefixes) {
			if (layer.match?.(prefix + probeSuffix)) {
				return layer.path || "";
			}
		}

		// Fallback: try matching just "/" which works for catch-all mounts
		if (layer.match?.("/")) {
			return layer.path || "";
		}

		return "";
	}

	private parseEndpoints(
		app: any,
		basePath = "",
		endpoints: Endpoint[] = [],
	): Endpoint[] {
		const stack = app.stack || app.router?.stack || app._router?.stack;

		if (!stack) {
			return endpoints;
		}

		for (const layer of stack) {
			if (layer.route) {
				// Direct route — has .route.path and .route.methods
				const route = layer.route;
				const paths: string[] = Array.isArray(route.path)
					? route.path
					: [route.path];

				for (const p of paths) {
					const completePath =
						basePath && p === "/" ? basePath : `${basePath}${p}`;
					RouteResolver.mappedRoutes.push({
						path: completePath,
						handler: route.stack?.map((item: any) => item.handle).pop(),
					});
					endpoints = this.addEndpoints(endpoints, [
						{
							path: completePath,
							methods: this.getRouteMethods(route),
							middlewares: this.getRouteMiddlewares(route),
						},
					]);
				}
			} else if (layer.handle?.stack) {
				// Sub-router — recurse into its stack
				const prefix = this.discoverLayerPrefix(layer);
				endpoints = this.parseEndpoints(
					layer.handle,
					basePath + prefix,
					endpoints,
				);
			}
		}

		return endpoints;
	}

	private addEndpoints(
		currentEndpoints: Endpoint[],
		endpointsToAdd: Endpoint[],
	): Endpoint[] {
		endpointsToAdd.forEach((newEndpoint) => {
			const existingEndpoint = currentEndpoints.find(
				(item) => item.path === newEndpoint.path,
			);

			if (existingEndpoint !== undefined) {
				const newMethods = newEndpoint.methods.filter(
					(method) => !existingEndpoint.methods.includes(method),
				);

				existingEndpoint.methods = existingEndpoint.methods.concat(newMethods);
			} else {
				currentEndpoints.push(newEndpoint);
			}
		});

		return currentEndpoints;
	}

	private getEndpoints(app: any): Endpoint[] {
		return this.parseEndpoints(app);
	}
}
