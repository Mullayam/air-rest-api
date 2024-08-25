import type { NextFunction, Request, RequestHandler, Response } from 'express';

// Define the decorator function
export function SetMiddleware(middlewareFunction: RequestHandler): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            middlewareFunction(req, res, () => {
                originalMethod.call(this, req, res, next);
            });
        };
    };
}
export function UseMiddleware<T>(middlewareInstance: any): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        // Replace the original method with the new one
        const intance = new middlewareInstance();
        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            intance.activate(req, res, () => {
                originalMethod.call(this, req, res, next);
            });
        };
        return descriptor;
    };
}

export function Middleware(middleware: (req: Request, res: Response, next: NextFunction) => void) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            middleware(req, res, next);
            return originalMethod.apply(this, arguments);
        };

        return descriptor;
    };
}