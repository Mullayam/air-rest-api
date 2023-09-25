import  {  Router } from 'express'
import { Routes } from '../app/lib/RoutesHandler.js';
import { XResponse } from "../app/lib/Response.js";
import { HttpException } from '../app/lib/ExceptionHandler.js';
import { MailRoutes } from './mailRoutes.js';
import { RouterHandler } from './router.js';

export class AppRoutes extends Routes {
    constructor(public router: Router = Router()) {
        super(router)       
        this.LoadExtendedRoutes()         
        this.UnhandledRoutes();
    }
    
    private LoadExtendedRoutes(): void {
        this.router.use("/e", new MailRoutes().mailRoute)       
        this.router.use(new RouterHandler().router) 
    }
    
    /**
     * Handles unhandled routes by throwing a HttpException.
     *     
     */
    private UnhandledRoutes(): void {
        this.router.use("*", () => { throw new HttpException({ name: "NOT_FOUND", message: "Route Error", stack: { info: "App Route Not Found", path: XResponse.Request().baseUrl } }) })
    }

}