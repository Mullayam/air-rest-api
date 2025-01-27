import type { Request, Response } from "express";

class AuthController {
	async Login(req: Request, res: Response) {
		try {
			res.json({ message: "OK", result: null, success: false }).end();
		} catch (error: any) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({
				message: "Something went wrong",
				result: null,
				success: false,
			}).end();
		}
	}

 
}

export default new AuthController();
