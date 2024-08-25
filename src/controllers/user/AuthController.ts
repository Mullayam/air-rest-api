import type { Request, Response } from "express";


class AuthController {     
    
    async Hello(req: Request, res: Response) {
        try {
            
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {            
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
}

export default new AuthController()