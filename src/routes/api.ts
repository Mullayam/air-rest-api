//  Write Your All Routes Here

import { Router } from 'express'
import { HttpException } from '../app/lib/ExceptionHandler.js';
import { XResponse } from '../app/lib/Response.js';
 
export class ApiRoutes {
    constructor(public apiRoutes: Router) {
        this.PublicRoutes();
        this.ProtectedRoutes();
        this.UnhandledRoutes();
    }

    private PublicRoutes(): void {
        this.apiRoutes.get("/test2", () => XResponse.JSON({message:"Public test Route"}))

    }
    protected ProtectedRoutes() {

    }
    private UnhandledRoutes(): void {
        this.apiRoutes.all("*", () => { throw new HttpException({ name: "NOT_FOUND", message: "Route Error", stack: "Route Not Found" }) })
    }

}