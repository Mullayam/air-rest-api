import type { Request, Response } from "express";

class BaseController {

    async GetAnalytics(req: Request, res: Response) {
        try {
            res.json({ message:"ok", result: null, success: false })
        } catch (error: any) {
            res.json({ message: error.message, result: null, success: false })
        }
    }
     
    async GetDefaultAmount(req: Request, res: Response) {
        try {
           
            return res.json({ message: "Get Default Amount", result: "data", success: true })
        } catch (error: any) {
            return res.json({ message: "Error occured", result: null, success: false })
        }
    }
}
export default new BaseController()