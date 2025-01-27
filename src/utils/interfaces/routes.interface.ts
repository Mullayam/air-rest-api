import type { Request, Response } from "express";
export type RoutingMethods =
	| "GET"
	| "POST"
	| "PUT"
	| "DELETE"
	| "PATCH"
	| "OPTIONS"
	| "HEAD"
	| "ALL";
export interface RoutesTypes {
	routeName: string;
	method: RoutingMethods;
	path: string;
	handler: (req: Request, res: Response) => any;
	middleware?: [];
}
export interface RoutesTypes {
	parseRequest?: true;
	parseHandler?: (req: Request, res: Response) => any;
}
export interface RoutesTypes {
	onRequest?: (req: Request, res: Response) => any;
	beforeRequest?: (req: Request, res: Response) => any;
	afterResponse?: (req: Request, res: Response) => any;
}
