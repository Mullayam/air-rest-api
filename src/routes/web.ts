import { Router } from 'express'
import { ApiRoutes } from './api.js';
import { Routes } from '../app/lib/RoutesHandler.js';
import { XResponse } from "../app/lib/Response.js";
import { HttpException } from '../app/lib/ExceptionHandler.js';
import { MailRoutes } from './mailRoutes.js';

export class AppRoutes extends Routes {
    constructor(public router: Router = Router()) {
        super(router)        
        this.PublicRoutes();
        this.ProtectedRoutes();
        this.LoadExtendedRoutes()
        this.UnhandledRoutes();
    }
    /**
     * Handles Public/Local Routes
     *
     * @private
     * @returns {void} 
     */
    private PublicRoutes(): void {
        this.router.get("/test",() => XResponse.JSON({ message: "Public test Route1" }))
    }

    protected ProtectedRoutes() {}
    
    /**
     * Loads extended routes.
     *
     * @private
     * @memberof ClassName
     * @return {void}
     */
    private LoadExtendedRoutes(): void {
        this.router.use("/e",new MailRoutes().mailRoute)
        this.router.use("/api/v1",new ApiRoutes().apiRoutes)
    }
    /**
     * Handles unhandled routes by throwing a HttpException.
     *     
     */
    private UnhandledRoutes(): void {
        this.router.use("*", () => { throw new HttpException({ name: "NOT_FOUND", message: "Route Error", stack: { info: "App Route Not Found", path: XResponse.Request().baseUrl }  }) })
    }

}