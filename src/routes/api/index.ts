import { Router} from "express";
import {UserAuthController} from "@/handlers/controllers/user";

const router = Router();

router.get("/2",UserAuthController.default.Hello2)





export default  router