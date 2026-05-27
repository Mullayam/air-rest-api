import type { NextFunction, Request, Response } from "express";
import type { ExpressMiddleware } from "@/utils/interfaces";

export class TestMiddleware implements ExpressMiddleware {
	async activate(_req: Request, _res: Response, next: NextFunction) {
		console.log("first middleware");
		next();
	}
}
