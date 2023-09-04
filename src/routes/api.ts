//  Write Your All API Routes Here

import { Router } from 'express'
import { HttpException } from '../app/lib/ExceptionHandler.js';
import { XResponse } from '../app/lib/Response.js';

export class ApiRoutes {
    constructor(public apiRoutes: Router = Router()) {
        this.PublicRoutes();
        this.ProtectedRoutes();
        this.UnhandledRoutes();
    }

    /**
     Creates the Public Routes 
     */
    private PublicRoutes(): void {
        this.apiRoutes.get("/test2", () => XResponse.JSON({ message: "Public test Route2" }))
    }
    /**
     * Creates the protected routes.
     *
     * @protected
     * @return {void}
     */
    protected ProtectedRoutes(): void {

    }
    /**
     * A function to handle unhandled routes.
     *
     * @returns {void} This function does not return anything.
     */
    private UnhandledRoutes(): void {
        this.apiRoutes.use("/*", () => { throw new HttpException({ name: "NOT_FOUND", message: "Api Route Error", stack: { info: "Api Route Not Found", path: XResponse.Request().baseUrl } }) })
    }

}