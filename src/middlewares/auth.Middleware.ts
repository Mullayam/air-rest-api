import { RouteResolver } from "@/app/common/RouteResolver";
import { __CONFIG__ } from "@/app/config";
import { PUBLIC_ROUTE_KEY } from "@/utils/helpers/constants";
import type { IUser } from "@/utils/interfaces/user.interface";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { match } from "path-to-regexp";

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
			const routeHandler = RouteResolver.mappedRoutes.find((layer: any) => {
				const path = req.originalUrl.split("?")[0];
				const matcher = match(layer.path, { decode: decodeURIComponent });
				const result = matcher(path);
				// const regex = new RegExp(
				//     `^${layer.path
				//         .replace(/\/:([^/]+)\?/g, '(?:/[^/]*)?')
				//         .replace(/\/:([^/]+)/g, '/[^/]+')}$`
				// );
				// return regex.test(path);
				return !!result;
			})?.handler;
			const isPublicRoute =
				routeHandler && Reflect.getMetadata(PUBLIC_ROUTE_KEY, routeHandler);

			if (isPublicRoute) {
				return next();
			}
			const authHeader =
				req.cookies?.access_token ||
				(req.headers.authorization as string) ||
				null;

			if (!authHeader) {
				res
					.json({
						message: "Athorization header is missing",
						result: null,
						success: false,
					})
					.end();

				return;
			}
			const token = authHeader?.replace("JWT ", "");
			if (!token) {
				res
					.json({
						message: "Authorization Token is missing",
						result: null,
						success: false,
					})
					.end();
				return;
			}
			const decodedToken = jwt.verify(
				token,
				__CONFIG__.SECRETS.JWT_SECRET_TOKEN,
			) as IUser;
			if (!decodedToken) {
				res
					.json({ message: "Invalid Token", result: null, success: false })
					.end();
				return;
			}
			if (decodedToken.role !== "User") {
				res
					.json({ message: "Access Denied", result: null, success: false })
					.end();
				return;
			}
			// req.session["user"] = decodedToken
			req.user = decodedToken;
			// fetch client secerert from db or redis connection, for eg we use uid as secret
			req.clientSecret = decodedToken.uid || __CONFIG__.SECRETS.APP_SECRET;
			next();
		} catch (error: any) {
			res
				.json({
					message: "Invalid Token",
					result: error.message,
					success: false,
				})
				.end();
			return;
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
			const authHeader =
				req.cookies?.access_token ||
				(req.headers.authorization as string) ||
				null;

			if (!authHeader) {
				res
					.json({
						message: "Authorization header is missing",
						result: null,
						success: false,
					})
					.end();
				return;
			}
			const token = authHeader?.replace("JWT ", "");
			if (!token) {
				res
					.json({
						message: "Authorization Token is missing",
						result: null,
						success: false,
					})
					.end();
				return;
			}
			const decodedToken = jwt.verify(
				token,
				__CONFIG__.SECRETS.JWT_SECRET_TOKEN,
			);
			if (!decodedToken) {
				res.json({ message: "Invalid Token", result: null, success: false });
				return;
			}
			res
				.json({
					message: "Validated Token",
					result: decodedToken,
					success: true,
				})
				.end();
			return;
		} catch (error: any) {
			res
				.json({
					message: "Invalid Token",
					result: error.message,
					success: false,
				})
				.end();
			return;
		}
	}
}
