
import { HttpStatus } from "@/utils/decorators/core.decorator";
import { NotFound } from "@/utils/decorators/error.decorator";
import type { Request, Response } from "express";
 
class AdminAuthController {
    

    
    async HandleLogin(req: Request, res: Response) {
       throw new Error(

        "ssdsds"
       )
    }

    async HandleLogout(req: Request, res: Response) {
        try {
            // req.session.destroy()
            return res.json({ message: "Login Successfull", result: null, success: true })
        } catch (error: any) {
            res.json({ message: error.message, result: error, success: false })
        }
    }

    async HandleUnlock(req: Request, res: any) {

    }
}
export default new AdminAuthController()