import { Routes } from 'app/lib/RoutesHandler';
import { Response, Request, Router } from 'express'
 
export class AppRoutes extends Routes {

    constructor(public router: Router = Router()) {
        super(router)
        this.router = router
        this.PublicRoutes();
        // this.ProtectedRoutes();
        // this.UnhandledRoutes();
    }
   
    
      private PublicRoutes(): void {        
        this.router.get("/test", (req: Request, res: Response) => {
            res.send("hi")
        })
    }
    protected ProtectedRoutes() {

    }
    private UnhandledRoutes(): void {
        // this.router.use("*", (req, res) => JSONResponse.Response(req, res, "API is Running", { error: "Not Found", code: 404, message: "Unhandled Route" }))
    }
}