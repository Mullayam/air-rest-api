import { Router} from "express";
import {UserAuthController} from "@/handlers/controllers/user";

const router = Router();

router.post("/login",UserAuthController.default.Login)
router.post("/register",UserAuthController.default.Register)
router.get("/refresh-token",UserAuthController.default.RefereshToken)





export default  router