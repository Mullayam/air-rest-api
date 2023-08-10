import { Http } from 'app/lib/Http';
import { NextFunction, Response, Request } from 'express';
import { HttpExceptionParams } from 'types';
import { AirResponse } from './Response';
import { Logging } from 'app/logs';
export class HttpException {

    constructor({ name, message, stack }: HttpExceptionParams) {
        let error = new Error(message);
        error.name = name || "Error";
        error.stack = stack
        throw error
    }
    static ExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
        const errStatus = Http.HttpStatus.NOT_FOUND;
        Logging.log("Error Handled ")
        const errMsg = err.message || 'Something went wrong';
        AirResponse.JSON(res, {
            success: false,
            status: errStatus,
            message: err.name,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        }, errStatus)
        next(errMsg)
    }


}