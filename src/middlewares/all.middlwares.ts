import type { NextFunction, Request, RequestHandler, Response } from "express";

class AllMiddlewares {
	public customMiddlewareFunction(
		_req: Request,
		_res: Response,
		next: NextFunction,
	) {
		// Your custom middleware logic goes here
		console.log("Custom Middleware executed");
		next();
	}
	logResponseTime(req: Request, res: Response, next: NextFunction) {
		const startHrTime = process.hrtime();
		res.on("finish", () => {
			const elapsedHrTime = process.hrtime(startHrTime);
			const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
			console.log(
				"%s %s %f in %fms",
				req.method,
				req.path,
				req.statusCode,
				elapsedTimeInMs.toFixed(4),
			);
		});
		next();
	}
}

// Singleton instance to avoid creating a new object on every request
const allMiddlewaresInstance = new AllMiddlewares();

export function ApplyMiddleware(
	middlewareFunction: keyof AllMiddlewares,
): RequestHandler {
	return (req: Request, res: Response, next: NextFunction) =>
		allMiddlewaresInstance[middlewareFunction](req, res, next);
}
