import type { NextFunction, Request, Response } from "express";
import session from "express-session";
export class SessionMiddleware {
	/**
	 * Validates if the user is an admin by checking the session ID.
	 *
	 * @param {Request} req - The request object.
	 * @param {Response} res - The response object.
	 * @param {NextFunction} next - The next middleware function.
	 */
	static async validateAdmin(req: Request, res: Response, next: NextFunction) {
		try {
			const sessionId = String(req.headers.sessionid) || null;
			if (!sessionId || sessionId === "null" || sessionId === "undefined") {
				return res.json({
					message: "Session Id is missing",
					result: null,
					success: false,
				});
			}

			const session: Partial<session.SessionData> | undefined =
				await new Promise((resolve, reject) => {
					req.sessionStore.get(sessionId, (err, session) => {
						if (err) reject(err);
						if (session) resolve(session);
						if (typeof session === "undefined") resolve(session);
					});
				});

			if (typeof session === "undefined") {
				return res.json({
					message: "Invalid Session",
					result: null,
					success: false,
				});
			}
			if (!session.hasOwnProperty(sessionId)) {
				return res.json({
					message: "Invalid Session",
					result: null,
					success: false,
				});
			}
			next();
		} catch (error: any) {
			return res.json({ message: error.message, result: null, success: false });
		}
	}
}
