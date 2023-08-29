import { Routes } from '../app/lib/RoutesHandler.js';
import { Router } from 'express'
import { XResponse } from "../app/lib/Response.js";
import { HttpException } from '../app/lib/ExceptionHandler.js';
import { ApiRoutes } from './api.js';

export class AppRoutes extends Routes {
    constructor(public router: Router = Router()) {
        super(router)
        this.router = router
        this.PublicRoutes();
        this.ProtectedRoutes();
        this.ApiRoutesInstance()
        this.UnhandledRoutes();
    }

    /**
     * Handles Public/Local Routes
     *
     * @private
     * @returns {void} 
     */
    private PublicRoutes(): void {
        this.router.get("/test", () => XResponse.Redirect("/test2"))
    }

    protected ProtectedRoutes() { }
    /**
    * Initializes an instance of the ApiRoutes class.
    *
    * @return {void}
    */
    private ApiRoutesInstance(): void {
        this.router.use("/api/v1",new ApiRoutes(this.router).apiRoutes)
    }
    /**
     * Handles unhandled routes by throwing a HttpException.
     *     
     */
    private UnhandledRoutes(): void {
        this.router.use("*", () => { throw new HttpException({ name: "NOT_FOUND", message: "Route Error", stack: "Route Not Found" }) })
    }

}