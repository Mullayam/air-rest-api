
import type { Request, Response } from "express";
 
class AdminAuthController {
    async HandleLogin(req: Request, res: Response) {
        let error: string[] = [];
        try {
            
            return res.json({ message: "Login Successfull", result:" { ...AdminData, token, sessionId: sid }", success: true })
        } catch (error: any) {
            return res.json({ message: error.message, result: error, success: false })
        }
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