import jwt from "jsonwebtoken";
import { CONFIG } from "@/app/config";
import { interval, timer } from "rxjs";
import type { Request, Response, NextFunction } from "express";
import { IUser } from "@/utils/types";
import { AllowedRoles } from "@/utils/types/user.interface";

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


export function isAuthorized(opts: { isPublic: boolean } = { isPublic: false }) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            try {
                if (opts.isPublic) return next();
                const authHeader = req.headers["authorization"] as String || null

                if (!authHeader) {
                    return res.status(400).json({ message: "Authorization header is missing", result: null, success: false })
                }
                if (authHeader.trim() === "" || authHeader.includes("JWT ")) {
                    return res.status(400).json({ message: "Token is missing", result: null, success: false })
                }
                const token = authHeader?.replace("JWT ", "")
                if (!token) {
                    return res.status(401).json({ message: "Authorization Token is missing", result: null, success: false })
                }
                const decodedToken = jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY) as IUser
                if (!decodedToken) {
                    return res.status(401).json({ message: "Invalid Token", result: null, success: false })
                }
                // req.session["user"] = decodedToken 
                (req as any).user = decodedToken;

                return originalMethod.apply(this, [req, res, next]);
            } catch (error) {
                return res.status(401).json({ message: "Token is invalid", result: null, success: false })
            }
        };

        return descriptor;
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
