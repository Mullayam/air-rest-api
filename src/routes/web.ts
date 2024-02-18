import { Router, Request, Response } from "express";
import { Exception } from "@enjoys/exception"
import { ApiRoutes } from "./api.routes";

export class AppRoutes {
    router = Router();
    constructor() {
        this.PublicRoutes();
        this.HandleRoutes();
        this.UnhandledRoutes();
    }
    /**
    Creates the Public Routes 
    */
    private PublicRoutes(): void {
        /** PUBLIC ROUTES */
        
    }

    HandleRoutes() {
        this.router.use("/api/v1", new ApiRoutes().apiRoutes)
    }
    private UnhandledRoutes(): void {
        process.env.NODE_ENV !== "production" &&
            this.router.use("*", (req: Request, res: Response) => {
                throw new Exception.HttpException({ name: "FORBIDDEN", message: "Access Denied", stack: { info: "Forbidden Resource", path: req.baseUrl, method: req.method } })
            }
            )
    }
}

