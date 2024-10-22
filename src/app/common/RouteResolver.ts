import { Logging } from "@/logs";
import { Application } from "express"
import { bgCyan, bgMagenta, bgWhite, blackBright, blue, blueBright, bold, cyan, gray, green, magenta, red, redBright, yellow } from 'colorette';
import { SetAppRoutes } from "@/utils/helpers";

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

const EXPRESS_ROOT_PATH_REGEXP_VALUE = '/^\\/?(?=\\/|$)/i';
const STACK_ITEM_VALID_NAMES = ['router', 'bound dispatch', 'mounted_app'];
export class RouteResolver {
    private print(path: any, layer: any) {
        if (layer.route) {
            layer.route.stack.forEach(print.bind(path.concat(this.split(layer.route.path))))
        } else if (layer.name === 'router' && layer.handle.stack) {
            layer.handle.stack.forEach(print.bind(path.concat(this.split(layer.regexp))))
        } else if (layer.method) {
            console.log('%s /%s',
                layer.method.toUpperCase(),
                path.concat(this.split(layer.regexp)).filter(Boolean).join('/'))
        }
    }

    private split(thing: any) {
        if (typeof thing === 'string') {
            return thing.split('/')
        } else if (thing.fast_slash) {
            return ''
        } else {
            var match = thing.toString()
                .replace('\\/?', '')
                .replace('(?=\\/|$)', '$')
                .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
            return match
                ? match[1].replace(/\\(.)/g, '$1').split('/')
                : '<complex:' + thing.toString() + '>'
        }
    }

    static Mapper(AppServer: Application, options: { listEndpoints: boolean, onlyPaths?: boolean } = { listEndpoints: false, onlyPaths: false }) {
        if (options.listEndpoints) {
            this.prototype.getEndpoints(AppServer).forEach((endpoint, key, arr) => {
                SetAppRoutes.set(endpoint.path, endpoint.methods)
                const str = `${endpoint.methods.includes('GET') ? bold(bgWhite(gray('GET')))
                    : endpoint.methods.includes('POST') ? bold(bgCyan(blue('POST')))
                        : endpoint.methods.includes('PATCH') ? bold(bgCyan(magenta('PATCH')))
                            : endpoint.methods.includes('PUT') ? bold(bgMagenta(green('PUT')))
                                : endpoint.methods.includes('DELETE') ? bold(bgWhite(red('DELETE')))
                                    : endpoint.methods.includes('ALL') ? bold(bgWhite(cyan('ALL')))
                                        : endpoint.methods.includes('OPTIONS') ? bold(bgWhite(redBright('OPTIONS')))
                                            : endpoint.methods.includes('HEAD') ? bold(bgWhite(blackBright('HEAD')))
                                                : options.onlyPaths ? blueBright(endpoint.middlewares.join()) : bold(yellow(endpoint.methods.join(', ')))} ${blueBright(endpoint.middlewares.join())} - ${yellow(endpoint.path)}`

                Logging.dev(str);
            });

        }

        // AppServer._router.stack.forEach(this.print.bind([]))
    }
    private hasParams(expressPathRegExp: string): boolean {
        return regexpExpressParamRegexp.test(expressPathRegExp);
    };
    private getRouteMethods(route: any): RouteMethods {
        let methods = Object.keys(route.methods);

        methods = methods.filter((method) => method !== '_all');
        methods = methods.map((method) => method.toUpperCase());

        return methods;
    }
    private getRouteMiddlewares(route: any): Middlewares {
        return route.stack.map((item: any) => {
            return item.handle.name || 'anonymous';
        });
    }
    private parseExpressRoute(route: any, basePath: string): Endpoint[] {
        const paths: string[] = [];
        const _this = this
        if (Array.isArray(route.path)) {
            paths.push(...route.path);
        } else {
            paths.push(route.path);
        }

        const endpoints = paths.map((path) => {
            const completePath = basePath && path === '/' ? basePath : `${basePath}${path}`;

            const endpoint: Endpoint = {
                path: completePath,
                methods: _this.getRouteMethods(route),
                middlewares: _this.getRouteMiddlewares(route),
            };

            return endpoint;
        });

        return endpoints;
    };
    private parseExpressPath(expressPathRegExp: RegExp, params: any[]): string {
        let expressPathRegExpExec = regExpToParseExpressPathRegExp.exec(expressPathRegExp.toString());
        let parsedRegExp = expressPathRegExp.toString();
        let paramIndex = 0;

        while (this.hasParams(parsedRegExp)) {
            const paramName = params[paramIndex].name;
            const paramId = `:${paramName}`;

            parsedRegExp = parsedRegExp.replace(regExpToReplaceExpressPathRegExpParams, paramId);

            paramIndex++;
        }

        if (parsedRegExp !== expressPathRegExp.toString()) {
            expressPathRegExpExec = regExpToParseExpressPathRegExp.exec(parsedRegExp);
        }

        const parsedPath = expressPathRegExpExec?.[1].replace(/\\\//g, '/');

        return parsedPath as string;
    };
    private parseEndpoints(app: any, basePath = '', endpoints: Endpoint[] = []): Endpoint[] {
        const stack = app.stack || (app._router && app._router.stack);

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
    };

    private addEndpoints(currentEndpoints: Endpoint[], endpointsToAdd: Endpoint[]): Endpoint[] {

        endpointsToAdd.forEach((newEndpoint) => {
            const existingEndpoint = currentEndpoints.find((item) => item.path === newEndpoint.path);

            if (existingEndpoint !== undefined) {
                const newMethods = newEndpoint.methods.filter((method) => !existingEndpoint.methods.includes(method));

                existingEndpoint.methods = existingEndpoint.methods.concat(newMethods);
            } else {
                currentEndpoints.push(newEndpoint);
            }
        });

        return currentEndpoints;
    };

    private parseStack(stack: StackItem[], basePath: string, endpoints: Endpoint[]): Endpoint[] {
        stack.forEach((stackItem) => {
            if (stackItem.route) {
                const newEndpoints = this.parseExpressRoute(stackItem.route, basePath);

                endpoints = this.addEndpoints(endpoints, newEndpoints);
            } else if (STACK_ITEM_VALID_NAMES.includes(stackItem.name || '')) {
                const isExpressPathRegexp = regExpToParseExpressPathRegExp.test(stackItem.regexp?.toString() || '');

                let newBasePath = basePath;

                if (isExpressPathRegexp) {
                    const parsedPath = this.parseExpressPath(stackItem.regexp as RegExp, stackItem.keys);

                    newBasePath += `/${parsedPath}`;
                } else if (
                    !stackItem.path &&
                    stackItem.regexp &&
                    stackItem.regexp.toString() !== EXPRESS_ROOT_PATH_REGEXP_VALUE
                ) {
                    const regExpPath = ` RegExp(${stackItem.regexp}) `;

                    newBasePath += `/${regExpPath}`;
                }

                endpoints = this.parseEndpoints(stackItem.handle, newBasePath, endpoints);
            }
        });

        return endpoints;
    };

    private getEndpoints(app: any): Endpoint[] {
        const endpoints = this.parseEndpoints(app);

        return endpoints;
    };
}