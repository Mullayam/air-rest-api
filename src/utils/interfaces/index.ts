import type { NextFunction, Request, Response } from "express";

export interface ExpressMiddleware {
	activate(req: Request, res: Response, next: NextFunction): void;
}

export function PartialType<T>(BaseClass: new () => T): new () => Partial<T> {
	abstract class PartialClassType {}
	Object.assign(PartialClassType.prototype, BaseClass.prototype);
	return PartialClassType as new () => Partial<T>;
}

export interface CustomResponse {
	success: boolean;
	message: string;
	result: null | Record<string, any>;
	[key: string]: any;
}

export interface InterceptorsSettings {
	response: Record<string, any>;
	isEnable?: boolean;
}
