import jwt from "jsonwebtoken";
import { __CONFIG__ } from "@/app/config";
import { interval, timer } from "rxjs";
import type { Request, Response, NextFunction } from "express";
import { AllowedRoles, IUser } from "@/utils/interfaces/user.interface";
import { LIFECYCLE_HOOKS_KEY, PUBLIC_ROUTE_KEY } from "../helpers/constants";
import { AppEvents } from '../services/Events';

function handleAuthorization(
    req: Request,
    res: Response,
    next: NextFunction,
    opts: { isPublic: boolean },
    callback: () => void
) {
    try {
        if (opts.isPublic) {
            return next();
        }

        const authHeader = (req.headers["authorization"] as string) || null;

        if (!authHeader) {
            return res.status(400).json({ message: "Authorization header is missing", result: null, success: false });
        }

        if (authHeader.trim() === "" || !authHeader.includes("JWT ")) {
            return res.status(400).json({ message: "Token is missing or invalid", result: null, success: false });
        }

        const token = authHeader.replace("JWT ", "");
        if (!token) {
            return res.status(401).json({ message: "Authorization Token is missing", result: null, success: false });
        }

        const decodedToken = jwt.verify(token, __CONFIG__.SECRETS.JWT_SECRET_TOKEN) as IUser;
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid Token", result: null, success: false });
        }

        (req as any).user = decodedToken; // Attach the decoded token to the request

        return callback(); // Proceed to the original method
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid", result: null, success: false });
    }
}


export function PublicRoute(): ClassDecorator & MethodDecorator {
    return (target: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
        if (descriptor) {
            // If descriptor is present, the decorator is applied to a method
            const originalMethod = descriptor.value!;

            if (typeof originalMethod === 'function') {
                descriptor.value = function (...args: any[]) {
                    // Bind `this` to the class instance
                    return originalMethod.apply(this, args);
                };
            }

            Reflect.defineMetadata(PUBLIC_ROUTE_KEY, true, descriptor.value!);
        } else {
            // If descriptor is not present, the decorator is applied to a class
            const classPrototype = target.prototype;
            const methodNames = Object.getOwnPropertyNames(classPrototype).filter(
                (name) => typeof classPrototype[name] === 'function' && name !== 'constructor'
            );

            // Apply the decorator to each method in the class
            methodNames.forEach((methodName) => {
                const originalMethod = classPrototype[methodName];

                if (typeof originalMethod === 'function') {
                    // Wrap the method to ensure `this` binding
                    classPrototype[methodName] = function (...args: any[]) {
                        return originalMethod.apply(this, args);
                    };

                    Reflect.defineMetadata(PUBLIC_ROUTE_KEY, true, classPrototype[methodName]);
                }
            });
        }
    };
}

/**
 * Decorator function that checks if the user has the required roles to access a protected route.
 *
 * @template T - The type of the allowed roles.
 * @param {Array<T>|T} allowedRoles - The roles that are allowed to access the route.
 * @return {Function} - The decorator function that checks the user's roles.
 */
export function Accessible<T = AllowedRoles[]>(allowedRoles: T) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            try {
                const user = (req as any).user
                if (!user) {
                    return res.status(401).json({ message: 'User not authenticated', result: null, success: false });
                }
                const userRoles = (user.role).toUpperCase() || [];

                const hasRole = Array.isArray(allowedRoles)
                    ? allowedRoles.some(role => userRoles.includes(role.toUpperCase())!)
                    : userRoles.includes(allowedRoles);

                if (!hasRole) {
                    return res.status(401).json({ message: "Access Denied", result: null, success: false })
                }

                return originalMethod.apply(this, [req, res, next]);
            } catch (error) {
                return res.status(500).json({ message: "Internal Server Error", result: "Something went wrong", success: false })
            }
        };

        return descriptor;
    };
}


export function isAuthorized(opts: { isPublic: boolean } = { isPublic: false }): any {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (typeof propertyKey === 'undefined' && typeof descriptor === 'undefined') {
            const classConstructor = target;

            // Get all method names in the class prototype, excluding the constructor
            const methodNames = Object.getOwnPropertyNames(classConstructor.prototype).filter(
                methodName => methodName !== 'constructor'
            );

            // Wrap all methods with the authorization middleware
            for (const methodName of methodNames) {
                const originalMethod = classConstructor.prototype[methodName];

                if (typeof originalMethod === 'function') {
                    classConstructor.prototype[methodName] = function (req: Request, res: Response, next: NextFunction) {
                        handleAuthorization(req, res, next, opts, () => {
                            originalMethod.apply(this, arguments);
                        });
                    };
                }
            }
        }
        // Method-level decorator
        else if (propertyKey && descriptor) {
            const originalMethod = descriptor.value;

            descriptor.value = function (req: Request, res: Response, next: NextFunction) {
                handleAuthorization(req, res, next, opts, () => {
                    originalMethod.apply(this, arguments);
                });
            };

            return descriptor;
        }

    }
}


/**
 * Decorator to handle setInterval.
 *
 * @param {number} intervalTime - The time in milliseconds to wait before executing the original method.
 * @return {Function} - A decorator function that wraps the original method with a setInterval.
 */
export function HandleInterval(intervalTime: number) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const originalFunction = originalMethod.apply(this, args);
            const intervalObservable = interval(intervalTime);

            const subscription = intervalObservable.subscribe(() => {
                originalFunction.apply(this, args);
            });

            return subscription;
        };

        return descriptor;
    };
}

/**
 * Decorator function to handle setTimeout.
 *
 * @param {number} timeout - The time in milliseconds to wait before executing the original method.
 * @return {Function} - A decorator function that wraps the original method with a setTimeout.
 */
export function HandleTimeout(timeout: number) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const originalFunction = originalMethod.apply(this, args);
            const timeoutObservable = timer(timeout);

            const subscription = timeoutObservable.subscribe(() => {
                originalFunction.apply(this, args);
            });

            return subscription;
        };

        return descriptor;
    };
}
/**
 * Decorator function that adds hook enabling functionality to a target class.
 *
 * Adds an `onEnableHook` method to the target class, allowing it to initialize
 * and store modules for lifecycle events. It also defines metadata for the target 
 * and sets up a `ListenMethods` method to log the modules set for hooks.
 *
 * @return {Function} - A function that takes a target class and enhances it with
 * hook management capabilities.
 */
export function onEnableHook() {
    return function (target: any) {
        const existingModules = Reflect.getMetadata(LIFECYCLE_HOOKS_KEY, Reflect) || [];
        Reflect.defineMetadata(LIFECYCLE_HOOKS_KEY, [...existingModules, target], Reflect);
    };
}

/**
 * Decorator function that registers an event listener for the given event.
 *
 * @param {string} event - The event to listen for.
 * @param {Object} [options] - Options for the event listener.
 * @param {boolean} [options.async=false] - If true, the event listener will be
 *   called asynchronously. If false, the event listener will be called
 *   synchronously.
 * @return {Function} - A decorator function that registers the event listener.
 */
export function OnEvent(event: string, options?: { async: boolean }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        AppEvents.on(event, async (message: any) => {
            if (options?.async) {
                await originalMethod.apply(target, [message]);
            } else {
                originalMethod.apply(target, [message]);
            }
        });
    };
}

