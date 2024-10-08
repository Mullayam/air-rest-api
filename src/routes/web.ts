import { Router, Request, Response } from "express";
import { HttpException } from "@enjoys/exception"
import UserRoutes from "./api/user";
import { AdminAuthController } from "@/controllers/admin";


const router = Router();
router.get("/all", AdminAuthController.default.HandleLogin)


router.use("*", (req: Request, res: Response) => {
    throw new HttpException({ name: "NOT_FOUND", message: "Page Not Found", stack: { info: "Forbidden Resource", path: req.baseUrl, method: req.method } })
})


export default router