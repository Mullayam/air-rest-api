import type { NextFunction, Request, RequestHandler, Response } from 'express';

// Define the decorator function
export function SetMiddleware(middlewareFunction: RequestHandler): any {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        if (propertyKey && descriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (req: Request, res: Response, next: NextFunction) {
                middlewareFunction(req, res, () => {
                    originalMethod.call(this, req, res, next);
                });
            };
            return descriptor;
        }
        else {
            const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
                methodName => methodName !== 'constructor'
            );

            for (const methodName of methodNames) {
                const originalMethod = target.prototype[methodName];

                if (typeof originalMethod === 'function') {
                    target.prototype[methodName] = function (req: Request, res: Response, next: NextFunction) {
                        middlewareFunction(req, res, () => {
                            originalMethod.call(this, req, res, next);
                        });
                    };
                }
            }
        }
    };
}
export function UseMiddleware<T>(middlewareInstance: any): any {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        if (propertyKey && descriptor) {
            const originalMethod = descriptor.value;
            const instance = new middlewareInstance();

            descriptor.value = function (req: Request, res: Response, next: NextFunction) {
                instance.activate(req, res, () => {
                    originalMethod.call(this, req, res, next);
                });
            };
            return descriptor;
        }
        else {
            const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
                methodName => methodName !== 'constructor'
            );

            for (const methodName of methodNames) {
                const originalMethod = target.prototype[methodName];
                if (typeof originalMethod === 'function') {
                    const instance = new middlewareInstance();

                    target.prototype[methodName] = function (req: Request, res: Response, next: NextFunction) {
                        instance.activate(req, res, () => {
                            originalMethod.call(this, req, res, next);
                        });
                    };
                }
            }
        }
    };
}


/**
 * Decorator to attach a middleware function to a controller or a single method of a controller.
 * If used on a controller, the middleware function will be executed before any of the methods of the controller.
 * If used on a specific method of a controller, the middleware function will be executed before the method is called.
 * The middleware function is passed the request, response and next objects as arguments.
 * The middleware function must call next() to pass control to the next middleware in the chain or the method that was decorated.
 * If the middleware function does not call next(), the request will be blocked and the method will not be called.
 * export function Middleware(
    middleware: (req: Request, res: Response, next: NextFunction) => void
): MethodDecorator & ClassDecorator {
    return function (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) {
        // Apply middleware to a method
        if (propertyKey && descriptor) {
            const originalMethod = descriptor.value;

            descriptor.value = function (req: Request, res: Response, next: NextFunction) {
                middleware(req, res, () => {
                    originalMethod.apply(this, arguments);
                });
            };

            return descriptor;
        } 
        
        // Apply middleware to all methods in the class
        else {
            const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
                methodName => methodName !== 'constructor'
            );

            for (const methodName of methodNames) {
                const originalMethod = target.prototype[methodName];
                
                if (typeof originalMethod === 'function') {
                    target.prototype[methodName] = function (req: Request, res: Response, next: NextFunction) {
                        middleware(req, res, () => {
                            originalMethod.apply(this, arguments);
                        });
                    };
                }
            }
        }
    };
}  
 * @param {function} middleware - The middleware function to be executed.
 * @returns {MethodDecorator} - A method decorator that can be used to decorate a controller or a single method of a controller.
 */
 
export function Middleware(
    middleware: (req: Request, res: Response, next: NextFunction) => void
): any{
    return function (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) {
        // Class decorator (only 1 argument is passed)
        if (typeof propertyKey === 'undefined' && typeof descriptor === 'undefined') {
            const classConstructor = target;

            // Get all the method names in the class (excluding the constructor)
            const methodNames = Object.getOwnPropertyNames(classConstructor.prototype).filter(
                methodName => methodName !== 'constructor'
            );

            // Apply middleware to all methods in the class
            for (const methodName of methodNames) {
                const originalMethod = classConstructor.prototype[methodName];

                if (typeof originalMethod === 'function') {
                    classConstructor.prototype[methodName] = function (req: Request, res: Response, next: NextFunction) {
                        middleware(req, res, () => {
                            originalMethod.apply(this, arguments);
                        });
                    };
                }
            }
        } 
        // Method decorator (3 arguments are passed)
        else if (propertyKey && descriptor) {
            const originalMethod = descriptor.value;

            descriptor.value = function (req: Request, res: Response, next: NextFunction) {
                middleware(req, res, () => {
                    originalMethod.apply(this, arguments);
                });
            };

            return descriptor;
        }
    };
}
