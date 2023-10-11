import { NextFunction } from "express";
import { IAirMiddleware } from "../app/modules/core/middleware.js";


export class ControllerBasedMiddleware implements IAirMiddleware {
    useContext(req: Request, res: Response, next: NextFunction): void {
        console.log("Controller Based Middleware Called")
       next()
    }
    

}