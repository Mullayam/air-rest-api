import { OnAppShutDown } from "@/utils/types/application.interface";
import type { Request, Response } from "express";

class AuthController implements OnAppShutDown{
  
    onAppShutDown(): void {
        console.log("App is Shutting Down "+ AuthController.name)
    }
   async Hello(req: Request, res: Response):Promise<Response<any, Record<string, any>>>  {
        
        try {
            return res.json({ message: "OK", result: null, success: false })
        } catch (error: any) {
            return res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    Hello2(req: Request, res: Response) {
        res.json({ message: "OK", result: null, success: false })
        // try {
        //     return res.json({ message: "OK", result: null, success: false })
        // } catch (error: any) {
        //     return res.json({ message: "Something went wrong", result: null, success: false })
        // }
    }
}

export default new AuthController()