import { Router, Request, Response } from "express";
import { HttpException } from "@enjoys/exception"
import { Routes } from "./api/test";
import UserRoutes from "./api/user";


const router = Router();
export default (prefix:string ="/") => {
    function publicRoutes() {
        router.get("/", () => { })

    }
    function privateRoutes() {
        router.use(prefix).get("/", () => { })
    }
    router.use(prefix,UserRoutes)
    router.use("*", (req: Request, res: Response) => {
        throw new HttpException({ name: "FORBIDDEN", message: "Access Denied", stack: { info: "Forbidden Resource", path: req.baseUrl, method: req.method } })
    })
    return router
}

