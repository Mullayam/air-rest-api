import type { Request, Response } from "express";


class AuthController {

    async SendOTP(req: Request, res: Response) {
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            console.log(error)
            return res.json({ message: "Something went wrong", result: null, success: false })
        }

    }
    async VerifyOTP(req: Request, res: Response) {
        try {

        } catch (error: any) {
            return res.json({ message: error.message, result: null, success: false })

        }
    }
}
export default new AuthController()