import { CustomResponse } from "@/utils/interfaces";
import { AsyncHandler } from "@/utils/libs/AsyncHandler";
import type { Request, Response } from "express";

class AuthController {

    async Login(req: Request, res: Response) {
        try {
            res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            if (error instanceof Error) {
                res.json({ message: error.message, result: null, success: false })
                return;
            }
            res.json({ message: "Something went wrong", result: null, success: false })
        }
    }

    Register = AsyncHandler(async (req: Request, res: Response) => {      

        res.json({ message: "OK", result: null, success: true });
    })
    RefereshToken = AsyncHandler(async (req: Request, res: Response) => {      

        res.json({ message: "OK", result: null, success: true });
    })
}

export default new AuthController()