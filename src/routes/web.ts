import { Router, Request, Response } from "express";
import { HttpException } from "@enjoys/exception"
import ApiRoutes from "./api";
import { AdminAuthController } from "@handlers/controllers/admin";


const router = Router();
router.get("/all", AdminAuthController.default.HandleLogin)

router.use("/api", ApiRoutes);
router.use("*", (req: Request, res: Response) => {
    throw new HttpException({ name: "NOT_FOUND", message: "Page Not Found", stack: { info: "Forbidden Resource", path: req.baseUrl, method: req.method } })
})


export default router