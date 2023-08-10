import { Router } from 'express'
export class ApiRoutes {

    constructor(protected apiRoutes: Router) {

        this.PublicRoutes();
        this.ProtectedRoutes();
        this.UnhandledRoutes();
    }

    private PublicRoutes(): void {

    }
    protected ProtectedRoutes() {

    }
    private UnhandledRoutes(): void {
        // this.apiRoutes.use("*", (req, res) => JSONResponse.Response(req, res, "API is Running", { error: "Not Found", code: 404, message: "Unhandled Route" }))
    }

}