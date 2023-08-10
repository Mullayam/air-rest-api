import { Routes } from 'app/lib/RoutesHandler';
import { Response, Request, Router } from 'express'
import { AirResponse } from "app/lib/Response";
import { HttpException } from 'app/lib/ExceptionHandler';

export class AppRoutes extends Routes {
    constructor(public router: Router = Router()) {
        super(router)
        this.router = router
        this.PublicRoutes();
        // this.ProtectedRoutes();
        this.UnhandledRoutes();
    }


    private PublicRoutes(): void {
        this.router.get("/test", (req: Request, res: Response) => {
          res.json({ok:"REport"})
        })
    }
    protected ProtectedRoutes() {

    }
    private UnhandledRoutes(): void {
        this.router.use("*", (req, res) => { throw new HttpException({ message: "Route Error", stack: "Route Not Found" }) })
    }
}