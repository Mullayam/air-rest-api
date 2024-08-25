import { Response as ExpressResponse ,NextFunction,Request} from "express";
import { HttpStatusCodes } from "@/utils/types/httpCode.interface";


export class AirResponse {
    static JSON(res: ExpressResponse, response: any, code: number = 200): void {
        res.status(code).json(response);
    }
    static Message(res: ExpressResponse, response: any, code: number = 200): void {
        res.status(code).send(response)
    }

}
export class XResponse {
    private static res: ExpressResponse
    private static req: Request
    private static next: NextFunction
    constructor(req:Request,res: ExpressResponse,next:NextFunction) {
        XResponse.res = res
        XResponse.req = req
        XResponse.next = next
    }
    /**
     * Sends a JSON response with the specified status code.
     *
     * @param {any} response - The JSON response to send.
     * @param {number} statusCode - The status code to send (default: 200).
     * @return {void}
     */
    static JSON(response: any, statusCode: number = 200): void {
        XResponse.res.status(statusCode).json(response);
    }
    static Redirect(path: string): void {
        if (!path) {
            XResponse.Error({ name: "NOT_FOUND", message: "Redirection Failed, The Path must be defined and string, but got undefined", stack: "Redirection Path is undefined" }, "NOT_FOUND")
        }
        XResponse.res.redirect(path);
    }

    /**
     * Throws an HttpException with the provided response and statusCode.
     *
     * @param {any} response - the response object
     * @param {keyof HttpStatusCodes} statusCode - the status code (defaults to "INTERNAL_SERVER_ERROR")
     * @return {void} 
     */
    static Error(response: any, statusCode: keyof HttpStatusCodes = "INTERNAL_SERVER_ERROR"): void {
        // throw new HttpException({ name: statusCode, message: "Something Went Wrong", stack: process.env.NODE_ENV === 'development' ? response : {} })
    }
    static Request(): Request {
        return XResponse.req
    }
    static Skip(): NextFunction {
        return XResponse.next
    }

}



