import type { NextFunction, Request, Response } from "express";

export function useHttpsRedirection(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.get("X-Forwarded-Proto") === "http") {
		res.redirect(301, `https://${req.headers.host}${req.url}`);
	} else {
		next();
	}
}
