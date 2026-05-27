import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * A decorator that applies middleware to a controller or individual controller methods.
 *
 * This decorator takes an instance of a middleware class as an argument. The middleware class
 * should have a method called `activate` that takes 3 arguments: `req`, `res`, and `next`.
 *
 * If the decorator is used on a controller class, all methods of the controller will have the
 * middleware applied. If the decorator is used on a method, only that method will have the
 * middleware applied.
 *
 */
export function UseMiddleware<T>(middlewareInstance: any): any {
	// Create a single instance at decoration time, not per request
	const instance = new middlewareInstance();

	return (
		target: any,
		propertyKey?: string | symbol,
		descriptor?: PropertyDescriptor,
	) => {
		if (propertyKey && descriptor) {
			// Method decorator
			const originalMethod = descriptor.value;

			descriptor.value = function (...args: any[]) {
				const [req, res, next] = args;
				instance.activate(req, res, () => {
					originalMethod.apply(this, args);
				});
			};

			return descriptor;
		}
		if (!propertyKey && !descriptor) {
			// Class decorator
			const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
				(methodName) => methodName !== "constructor",
			);

			for (const methodName of methodNames) {
				const originalMethod = target.prototype[methodName];
				if (typeof originalMethod === "function") {
					target.prototype[methodName] = function (...args: any[]) {
						const [req, res, next] = args;
						instance.activate(req, res, () => {
							originalMethod.apply(this, args);
						});
					};
				}
			}
		}
	};
}

export function Middleware(
	middleware: (req: Request, res: Response, next: NextFunction) => void,
): any {
	return (
		target: any,
		propertyKey?: string | symbol,
		descriptor?: PropertyDescriptor,
	) => {
		// Class decorator (only 1 argument is passed)
		if (
			typeof propertyKey === "undefined" &&
			typeof descriptor === "undefined"
		) {
			const classConstructor = target;

			// Get all the method names in the class (excluding the constructor)
			const methodNames = Object.getOwnPropertyNames(
				classConstructor.prototype,
			).filter((methodName) => methodName !== "constructor");

			// Apply middleware to all methods in the class
			for (const methodName of methodNames) {
				const originalMethod = classConstructor.prototype[methodName];

				if (typeof originalMethod === "function") {
					classConstructor.prototype[methodName] = function (...args: any[]) {
						const [req, res, next] = args;
						middleware(req, res, () => {
							originalMethod.apply(this, args); // Preserve `this` context
						});
					};
				}
			}
		}
		// Method decorator (3 arguments are passed)
		else if (propertyKey && descriptor) {
			const originalMethod = descriptor.value;

			descriptor.value = function (...args: any[]) {
				const [req, res, next] = args;
				middleware(req, res, () => {
					originalMethod.apply(this, args); // Preserve `this` context
				});
			};

			return descriptor;
		}
	};
}
