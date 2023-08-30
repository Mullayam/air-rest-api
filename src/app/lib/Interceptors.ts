import { Request, Response, NextFunction } from "express";
 
import { Logging } from "../../logs/index.js";


class Interceptor {
    constructor(public req: Request, public res: Response, public next: NextFunction) {

    }
    useInterceptor() {
        return (function (req: Request, res: Response) {
 
        })

    }
}