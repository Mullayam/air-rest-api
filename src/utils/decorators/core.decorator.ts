import * as fs from "node:fs";
import * as path from "node:path";
import { Logging } from "@/logs";
import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import type { Observable } from "rxjs";
import helpers from "../helpers";
import type {
	FileHandler,
	FileUploadOptions,
} from "../interfaces/fileupload.interface";
import { HttpStatusCode } from "../interfaces/httpCode.interface";

/**
 * Redirects the user to the specified URL.
 *
 * @param {string} url - The URL to redirect to.
 * @return {Function} - A decorator function that redirects the user to the specified URL.
 */
export function Redirect(url: string) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = (req: Request, res: Response, next: NextFunction) => {
			res.redirect(url);
		};

		return descriptor;
	};
}
/**
 * A decorator function that sets the HTTP status code for a route handler.
 *
 * @param {number} statusCode - The HTTP status code to set.
 * @return {Function} - A decorator function that sets the HTTP status code for a route handler.
 */
export function HttpStatus<T extends keyof typeof HttpStatusCode | number>(
	statusCode: T,
) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = function (
			req: Request,
			res: Response,
			next: NextFunction,
		) {
			if (typeof statusCode === "string") {
				res.status(HttpStatusCode[statusCode]);
				return originalMethod.call(this, req, res, next);
			}
			res.status(statusCode);
			return originalMethod.call(this, req, res, next);
		};

		return descriptor;
	};
}

/**
 * Returns a decorator function that delays the response using the provided delay function.
 * @UseDelay((req, res, next) => {
    console.log('Interceptor called');
    return new Observable(observer => {
      // Perform some asynchronous operation
      setTimeout(() => {
        console.log('Interceptor completed');
        observer.next();
        observer.complete();
      }, 3000);
    });
  })
 * @param {Function} delayFunc - The function that introduces the delay.
 * @return {Function} The decorator function for delaying the response.
 */
export function UseDelayResponse(
	delayFunc: (req: Request, res: Response, next: () => void) => Observable<any>,
) {
	Logging.dev("Delay in Response is Initiated");
	return (target: any, key: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = function (req: any, res: any, next: () => void) {
			delayFunc(req, res, next).subscribe(() => {
				originalMethod.apply(this, [req, res, next]);
			});
		};
		return descriptor;
	};
}
/**
 * Returns a function decorator that handles file upload operations.
 *
 * @param {FileUploadOptions} data - Optional data for file uploads.
 * @return {Function} The decorated function for file upload handling.
 */
export function UploadFile(data?: FileUploadOptions) {
	return (target: any, key: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (req: any, res: any, next: () => void) {
			const uploadDirPath = helpers.CreatePath(
				data?.uploadDirPath || "public/uploads",
			);
			fs.mkdirSync(uploadDirPath, { recursive: true });
			try {
				if (!req.files || Object.keys(req.files).length === 0) {
					Logging.dev("No files found for upload.", "error");
					return originalMethod.call(this, req, res, next);
				}
				const filetack = req.files.filetack as FileHandler[] | FileHandler;
				const filesToProcess = Array.isArray(filetack) ? filetack : [filetack];

				// Process all files with Promise.all to avoid race conditions
				const results = await Promise.all(
					filesToProcess.map((file: FileHandler) => {
						return new Promise<any>((resolve, reject) => {
							const renameFile = file.name.replace(/\s+/g, "").trim();
							file.mv(
								`${path.join(uploadDirPath, renameFile)}`,
								(err: any) => {
									if (err) return reject(err);
									const id = helpers.Md5Checksum(Date.now().toString());
									const key = helpers.SimpleHash();
									const extension = file.name.split(".").pop() || "";
									resolve({ id, key, ...file, extension });
								},
							);
						});
					}),
				);

				req.body.uploadedFiles = results;
				return originalMethod.call(this, req, res, next);
			} catch (error: any) {
				return res.json({
					success: false,
					message: error.message,
					result: null,
				});
			}
		};
		return descriptor;
	};
}
/**
 * Throttles the API calls based on the specified delay.
 *
 * @param {number} delay - The delay in milliseconds for throttling.
 * @return {Function} The throttled function for API calls.
 */
export function ThrottleApi(delay: number) {
	Logging.dev("Response Throttling in API is Enabled");
	return (
		target: any,
		key: any,
		descriptor: { value: (...args: any[]) => Promise<any> },
	) => {
		const originalMethod = descriptor.value;
		// Each decorated method gets its own lastExecution tracker
		let lastExecution = 0;
		descriptor.value = async function (...args: any) {
			const now = Date.now();
			if (now - lastExecution >= delay) {
				lastExecution = now;
				return originalMethod.apply(this, args);
			}
			// Return 429 if it's an Express handler
			const [req, res] = args;
			if (res && typeof res.status === "function") {
				return res.status(429).json({
					message: "Too many requests, please try again later",
					result: null,
					success: false,
				});
			}
		};
		return descriptor;
	};
}
/**
 * A decorator function that adds validation logic to the target method.
 *
 * @param {any[]} validations - Array of validation rules to apply.
 * @returns {PropertyDescriptor} The updated property descriptor with validation logic.
 */
export function Validate(validations: any[]) {
	return (target: any, key: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (req: any, res: any, next: () => void) {
			try {
				await Promise.all(validations.map((rule: any) => rule.run(req)));

				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					const formattedErrors = errors.formatWith((x) => x.msg).array();
					return res.status(422).json({
						message: "Validation Error",
						result: formattedErrors,
						success: false,
					});
				}
				return await originalMethod.apply(this, [req, res, next]);
			} catch (error: any) {
				return res.status(500).json({
					message: "Internal Server Error",
					error: error.message,
					success: false,
				});
			}
		};

		return descriptor;
	};
}
