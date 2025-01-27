import type { ExpressMiddleware } from "@/utils/interfaces";
import type { NextFunction, Request, Response } from "express";

export class TestMiddleware implements ExpressMiddleware {
	async activate(req: Request, res: Response, next: NextFunction) {
		console.log("first middleware");
		next();
	}
}
