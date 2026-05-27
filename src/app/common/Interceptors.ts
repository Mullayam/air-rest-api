import { HttpException } from "@enjoys/exception";
import type { Application, NextFunction, Request, Response } from "express";
import { Logging } from "@/logs";
import type { InterceptorsSettings } from "@/utils/interfaces";

const ORIGINAL_RESPONSE = { response: { info: "Interceptor Response" } };
export class Interceptor {
	private static app: Application;
	private myResponse: Record<string, any>;
	constructor(
		private app: Application,
		settings: InterceptorsSettings,
	) {
		Interceptor.app = app;
		this.myResponse = settings.response;
		if (settings.isEnable) {
			this.InterceptResponse();
		}
	}
	private InterceptResponse() {
		Logging.dev("Modifying Response using Interceptor");
		Interceptor.app.use((_req: Request, res: Response, next: NextFunction) => {
			try {
				const oldJSON = res.json;
				res.json = (data) => {
					if (
						data &&
						typeof data === "object" &&
						typeof data.then === "function"
					) {
						return data
							.then((resData: any) => {
								res.json = oldJSON;
								return oldJSON.call(res, resData);
							})
							.catch((error: any) => {
								next(error);
							});
					}
					const output =
						data && typeof data === "object" && !Array.isArray(data)
							? { ...data, ...this.myResponse }
							: data;
					return oldJSON.call(res, output);
				};
				next();
			} catch (error) {
				throw new HttpException({
					name: "PAYLOAD_TOO_LARGE",
					message: "Something Went Wrong with Intercepting the Response",
					stack: error,
				});
			}
		});
	}

	public static useInterceptors(
		app: Application,
		settings: { response: Record<string, any>; isEnable?: boolean } = {
			...ORIGINAL_RESPONSE,
			isEnable: false,
		},
	) {
		if (!Interceptor.app) {
			new Interceptor(app, settings);
			return Interceptor;
		}
		return Interceptor;
	}
}
