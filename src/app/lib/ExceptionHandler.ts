import { NextFunction, Response, Request } from 'express';
import { HttpExceptionParams, HttpStatusCodes } from 'types/index.js';
import { Logging } from 'app/logs/index.js';
export class HttpException {
    constructor({ name, message, stack }: HttpExceptionParams) {
        this.ThrowNewException({ name, message, stack })
    }
    /**
 * Throws a new exception with the provided parameters.
 *
 * @param {HttpExceptionParams} name : The name, message, and stack of the exception.
 * @return {void}
 */
    private ThrowNewException({ name, message, stack }: HttpExceptionParams): void {
        Logging.error("New Error Thrown")
        let error = new Error(message);
        error.name = name;
        error.stack = stack
        throw error
    }
    /**
 * Handles exceptions that occur during the execution of the program.
 *
 * @param {Error} err : The exception that occurred.
 * @param {Request} req : The incoming HTTP request.
 * @param {Response} res : The HTTP response to be sent back.
 * @param {NextFunction} next : The next middleware function in the chain.
 */
    static ExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
        const errStatus = this.prototype.TypeOfError(err.name as keyof HttpStatusCodes);
        Logging.info("Error Handled")
        const errMsg = err.message || 'Something went wrong';
        res.status(errStatus).send({
            success: false,
            status: errStatus,
            type: err.name,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        })
        next(errMsg)
    }
    /**
  * Creates a new UnauthorizedException with the given payload.
  *
  * @param {HttpExceptionParams} payload : The payload for the exception.
  */
    static UnauthorizedException(payload: HttpExceptionParams) {
        new HttpException(payload)
    }
    private ExceptionsArray() {
        return {
            "FOUND": 302,
            "SEE_OTHER": 303,
            "NOT_MODIFIED": 304,
            "TEMPORARY_REDIRECT": 307,
            "RESUME_INCOMPLETE": 308,
            "OK": 200,
            "CREATED": 201,
            "ACCEPTED": 202,
            "NON_AUTHORITATIVE_INFORMATION": 203,
            "NO_CONTENT": 204,
            "RESET_CONTENT": 205,
            "PARTIAL_CONTENT": 206,
            "BAD_REQUEST": 400,
            "UNAUTHORIZED": 401,
            "FORBIDDEN": 403,
            "NOT_FOUND": 404,
            "METHOD_NOT_ALLOWED": 405,
            "REQUEST_TIMEOUT": 408,
            "CONFLICT": 409,
            "GONE": 410,
            "LENGTH_REQUIRED": 411,
            "PRECONDITION_FAILED": 412,
            "PAYLOAD_TOO_LARGE": 413,
            "REQUESTED_RANGE_NOT_SATISFIABLE": 416,
            "TOO_MANY_REQUESTS": 429,
            "CLIENT_CLOSED_REQUEST": 499,
            "INTEMAL_SERVER_ERROR": 500,
            "BAD_GATEWAY": 502,
            "SERVICE_UNAVAILABLE": 503,
            "GATEWAY_TIMEOUT": 504,
        }
    }

    /**
     * Returns a string representing the type of error based on the given code.
     *
     * @param {string} name - The http error name. 
     * @return {number} - The http error status code.
     */
    private TypeOfError(name: keyof HttpStatusCodes): number {
        const ExceptionObject = this.ExceptionsArray()
        return ExceptionObject[name]
    }

}