import jwt from "jsonwebtoken";
import type { Response, Request, NextFunction } from 'express'
import { AdminJwtPayload, DriverJwtPayload, UserInfoJwtPayload } from "@/utils/types";
import { CONFIG } from "@/app/config";
 
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
            const authHeader = req.headers["authorization"] as String || null

            if (!authHeader) {
                return res.json({ message: "Authorization header is missing", result: null, success: false })
            }
            const token = authHeader?.replace("JWT ", "")
            if (!token) {
                return res.json({ message: "Authorization Token is missing", result: null, success: false })
            }
            const decodedToken = jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY) as UserInfoJwtPayload
            if (!decodedToken) {
                return res.json({ message: "Invalid Token", result: null, success: false })
            }
            if (decodedToken.role !== "User") {
                return res.json({ message: "Access Denied", result: null, success: false })
            }
            req.session["user"] = decodedToken
            next()
        } catch (error: any) {
            return res.json({ message: "Invalid Token", result: error.message, success: false })
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
                return res.json({ message: "Authorization header is missing", result: null, success: false })
            }
            const token = authHeader?.replace("JWT ", "")
            if (!token) {
                return res.json({ message: "Authorization Token is missing", result: null, success: false })
            }
            const decodedToken = jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY) as AdminJwtPayload
            if (!decodedToken) {
                return res.json({ message: "Invalid Token", result: null, success: false })
            }
            return res.json({ message: "Validated Token", result: decodedToken, success: true })
        } catch (error: any) {
            return res.json({ message: "Invalid Token", result: error.message, success: false })
        }
    }
}