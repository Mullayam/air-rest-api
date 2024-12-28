import { Observable } from 'rxjs';
import * as path from 'path'
import * as fs from 'fs'
import type { NextFunction, Request, Response } from 'express';
import { FileHandler, FileUploadOptions } from '../interfaces/fileupload.interface';
import { validationResult } from 'express-validator';
import { Logging } from '@/logs';
import { HttpStatusCode } from '../interfaces/httpCode.interface';
import helpers from '../helpers';


/**
 * Redirects the user to the specified URL.
 *
 * @param {string} url - The URL to redirect to.
 * @return {Function} - A decorator function that redirects the user to the specified URL.
 */
export function Redirect(url: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
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
export function HttpStatus<T extends keyof typeof HttpStatusCode | number>(statusCode: T) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            if (typeof statusCode === 'string') {
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
export function UseDelayResponse(delayFunc: (req: Request, res: Response, next: () => void) => Observable<any>) {
    Logging.dev("Delay in Response is Initiated")
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
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
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (req: any, res: any, next: () => void) {
            const uploadDirPath = helpers.CreatePath(data?.uploadDirPath || 'public/uploads')
            fs.mkdirSync(uploadDirPath, { recursive: true })
            let FilesArray: any = []
            try {
                if (!req.files || Object.keys(req.files).length === 0) {
                    Logging.dev("No files found for upload.", "error")
                    return next()
                }
                const filetack = req.files.filetack as FileHandler[] | FileHandler
                if (Array.isArray(filetack)) {
                    filetack.forEach((file: FileHandler) => {
                        const renameFile = file.name.replace(/\s+/g, '').trim()
                        file.mv(`${path.join(uploadDirPath, renameFile)}`, async function (err: any) {
                            if (err) throw new Error(err)
                            const id = helpers.Md5Checksum(Date.now().toString())
                            const key = helpers.SimpleHash()
                            const extenstion = file.name.split('.')[1]
                            const createInfo = { id, key, ...file, extenstion }
                            FilesArray.push(createInfo)
                            req.body.uploadedFiles = FilesArray
                            return next()
                        })
                    })
                } else {

                    const renameFile = filetack.name.replace(/\s+/g, '').trim()
                    filetack.mv(`${path.join(uploadDirPath, renameFile)}`, async function (err: any) {
                        if (err) throw new Error(err)
                        const id = helpers.Md5Checksum(Date.now().toString())
                        const key = helpers.SimpleHash()
                        const extenstion = filetack.name.split('.')[1]
                        const createInfo = { id, key, ...filetack, extenstion }
                        FilesArray.push(createInfo)
                        req.body.uploadedFiles = FilesArray
                        return next()
                    })
                }
            } catch (error: any) {
                return res.json({
                    success: false,
                    message: error.message,
                    result: null
                })
            }
            originalMethod.call(this, req, res, next);
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
    Logging.dev("Response Throttling in API is Enabled")
    let lastExecution = 0;
    return function (target: any, key: any, descriptor: { value: (...args: any[]) => Promise<any>; }) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any) {
            const now = Date.now();
            if (now - lastExecution >= delay) {
                lastExecution = now;
                return originalMethod.apply(this, args);
            } else {
                console.log(`Method ${key} throttled.`);
            }
        };
    };
}
/**
 * A decorator function that adds validation logic to the target method.
 *
 * @param {any[]} validations - Array of validation rules to apply.
 * @returns {PropertyDescriptor} The updated property descriptor with validation logic.
 */
export function Validate(validations: any[]) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
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