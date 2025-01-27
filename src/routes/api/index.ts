import { UserAuthController } from "@/handlers/controllers/user";
import { Router } from "express";

const router = Router();

router.post("/login", UserAuthController.default.Login);


export default router;
