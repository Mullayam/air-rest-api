//  Write Your All API Routes Here

import { Router } from 'express'
import { HttpException } from '../app/lib/ExceptionHandler.js';
import { XResponse } from '../app/lib/Response.js';

export class ApiRoutes {
    constructor(public apiRoutes: Router) {
        this.PublicRoutes();
        this.ProtectedRoutes();
        this.UnhandledRoutes();
    }

    private PublicRoutes() {
        this.apiRoutes.get("/test2", () => XResponse.JSON({ message: "Public test Route2" }))
    }
    protected ProtectedRoutes() {

    }
    private UnhandledRoutes(){

        this.apiRoutes.use("/*", () => { throw new HttpException({ name: "NOT_FOUND", message: "Api Route Error", stack: "Api Route Not Found" }) })
    }

}