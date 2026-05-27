import { Logging } from "@/logs";
import { SetAppRoutes } from "@/utils/helpers";
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

type RouteMethods = string[];
type Middlewares = string[];

interface Endpoint {
	path: string;
	methods: RouteMethods;
	middlewares: Middlewares;
}

interface StackItem {
	route?: any;
	regexp?: RegExp;
	name?: string;
	path?: string;
	handle: any;
	keys: any[];
	methods: RouteMethods;
}
const regExpToParseExpressPathRegExp =
	/^\/\^\\\/(?:(:?[\w\\.-]*(?:\\\/:?[\w\\.-]*)*)|(\(\?:\(\[\^\\\/]\+\?\)\)))\\\/.*/;
const regExpToReplaceExpressPathRegExpParams = /\(\?:\(\[\^\\\/]\+\?\)\)/;
const regexpExpressParamRegexp = /\(\?:\(\[\^\\\/]\+\?\)\)/g;

const EXPRESS_ROOT_PATH_REGEXP_VALUE = "/^\\/?(?=\\/|$)/i";
const STACK_ITEM_VALID_NAMES = ["router", "bound dispatch", "mounted_app"];

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
		RouteResolver.prototype
			.getEndpoints(AppServer)
			.forEach((endpoint, key, arr) => {
				regExpToParseExpressPathRegExp.test(endpoint.path)
					? (RouteResolver.dynamicRoutes[endpoint.path] = endpoint.methods)
					: SetAppRoutes.set(endpoint.path, endpoint.methods);

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
	private hasParams(expressPathRegExp: string): boolean {
		return regexpExpressParamRegexp.test(expressPathRegExp);
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
			// Try function name, then wrapped _name, then toString extraction for arrow/anonymous fns
			if (fn.name && fn.name !== "anonymous") return fn.name;
			if (fn._name) return fn._name;
			// Extract name from function source for short functions
			const fnStr = fn.toString();
			const match = fnStr.match(/^(?:async\s+)?(\w+)\s*\(/);
			if (match && match[1] !== "function") return match[1];
			return "handler";
		});
	}
	private parseExpressRoute(route: any, basePath: string): Endpoint[] {
		const paths: string[] = [];
		if (Array.isArray(route.path)) {
			paths.push(...route.path);
		} else {
			paths.push(route.path);
		}

		const endpoints = paths.map((path) => {
			const completePath =
				basePath && path === "/" ? basePath : `${basePath}${path}`;
			RouteResolver.mappedRoutes.push({
				path: completePath,
				handler: route.stack.map((item: any) => item.handle).pop(),
			});
			const endpoint: Endpoint = {
				path: completePath,
				methods: this.getRouteMethods(route),
				middlewares: this.getRouteMiddlewares(route),
			};

			return endpoint;
		});

		return endpoints;
	}
	private parseExpressPath(expressPathRegExp: RegExp, params: any[]): string {
		let expressPathRegExpExec = regExpToParseExpressPathRegExp.exec(
			expressPathRegExp.toString(),
		);
		let parsedRegExp = expressPathRegExp.toString();
		let paramIndex = 0;

		while (this.hasParams(parsedRegExp)) {
			const paramName = params[paramIndex].name;
			const paramId = `:${paramName}`;

			parsedRegExp = parsedRegExp.replace(
				regExpToReplaceExpressPathRegExpParams,
				paramId,
			);

			paramIndex++;
		}

		if (parsedRegExp !== expressPathRegExp.toString()) {
			expressPathRegExpExec = regExpToParseExpressPathRegExp.exec(parsedRegExp);
		}

		const parsedPath = expressPathRegExpExec?.[1].replace(/\\\//g, "/");

		return parsedPath as string;
	}
	private parseEndpoints(
		app: any,
		basePath = "",
		endpoints: Endpoint[] = [],
	): Endpoint[] {
		const stack = app.stack || app._router?.stack;

		if (!stack) {
			endpoints = this.addEndpoints(endpoints, [
				{
					path: basePath,
					methods: [],
					middlewares: [],
				},
			]);
		} else {
			endpoints = this.parseStack(stack, basePath, endpoints);
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

	private parseStack(
		stack: StackItem[],
		basePath: string,
		endpoints: Endpoint[],
	): Endpoint[] {
		stack.forEach((stackItem) => {
			if (stackItem.route) {
				const newEndpoints = this.parseExpressRoute(stackItem.route, basePath);

				endpoints = this.addEndpoints(endpoints, newEndpoints);
			} else if (STACK_ITEM_VALID_NAMES.includes(stackItem.name || "")) {
				const isExpressPathRegexp = regExpToParseExpressPathRegExp.test(
					stackItem.regexp?.toString() || "",
				);

				let newBasePath = basePath;

				if (isExpressPathRegexp) {
					const parsedPath = this.parseExpressPath(
						stackItem.regexp as RegExp,
						stackItem.keys,
					);

					newBasePath += `/${parsedPath}`;
				} else if (
					!stackItem.path &&
					stackItem.regexp &&
					stackItem.regexp.toString() !== EXPRESS_ROOT_PATH_REGEXP_VALUE
				) {
					const regExpPath = ` RegExp(${stackItem.regexp}) `;

					newBasePath += `/${regExpPath}`;
				}

				endpoints = this.parseEndpoints(
					stackItem.handle,
					newBasePath,
					endpoints,
				);
			}
		});

		return endpoints;
	}

	private getEndpoints(app: any): Endpoint[] {
		const endpoints = this.parseEndpoints(app);

		return endpoints;
	}
}
