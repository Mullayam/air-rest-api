import jwt from "jsonwebtoken";
import type { Response, Request, NextFunction } from 'express'
import { __CONFIG__ } from "@/app/config";
import { RouteResolver } from "@/app/common/RouteResolver";
import { PUBLIC_ROUTE_KEY } from "@/utils/helpers/constants";
import { IUser } from "@/utils/interfaces/user.interface";
 
export class JwtAuth {
    /**
     * Validates the user's authorization token.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function in the middleware chain.
     * @return {void} This function does not return a value.
     */
    static validateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const routeHandler = RouteResolver.mappedRoutes.find((layer: any) => layer.path === req.originalUrl)?.handler;
            const isPublicRoute = routeHandler && Reflect.getMetadata(PUBLIC_ROUTE_KEY, routeHandler);

            if (isPublicRoute) {
                return next();
            }
            const authHeader = req.headers["authorization"] as String || null

            if (!authHeader) {
                res.json({ message: "Athorization header is missing", result: null, success: false }).end()

                return
            }
            const token = authHeader?.replace("JWT ", "")
            if (!token) {
                res.json({ message: "Authorization Token is missing", result: null, success: false }).end()
                return
            }
            const decodedToken = jwt.verify(token, __CONFIG__.SECRETS.JWT_SECRET_KEY) as IUser
            if (!decodedToken) {
                res.json({ message: "Invalid Token", result: null, success: false }).end()
                return
            }
            if (decodedToken.role !== "User") {
                res.json({ message: "Access Denied", result: null, success: false }).end()
                return
            }
            // req.session["user"] = decodedToken
            req.user = decodedToken
            // fetch client secerert from db or redis connection, for eg we use uid as secret
            req.clientSecret = decodedToken.uid || __CONFIG__.SECRETS.APP_SECRET
            next()
        } catch (error: any) {
            res.json({ message: "Invalid Token", result: error.message, success: false }).end()
            return
        }

    }
    /**
     * Validates if the user making the request is an admin.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     */


    static Me(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers["authorization"] as String || null

            if (!authHeader) {
                res.json({ message: "Authorization header is missing", result: null, success: false }).end()
                return
            }
            const token = authHeader?.replace("JWT ", "")
            if (!token) {
                res.json({ message: "Authorization Token is missing", result: null, success: false }).end()
                return
            }
            const decodedToken = jwt.verify(token, __CONFIG__.SECRETS.JWT_SECRET_KEY)
            if (!decodedToken) {
                res.json({ message: "Invalid Token", result: null, success: false })
                return
            }
            res.json({ message: "Validated Token", result: decodedToken, success: true }).end()
            return
        } catch (error: any) {
            res.json({ message: "Invalid Token", result: error.message, success: false }).end()
            return
        }
    }
}
