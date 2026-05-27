import { Router } from "express";
import { UserAuthController } from "@/handlers/controllers/user";

const router = Router();

router.post("/login", UserAuthController.default.Login);

export default router;
