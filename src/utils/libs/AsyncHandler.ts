import { Request, Response } from 'express';

export const AsyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
    return (req: Request, res: Response) => {
        Promise.resolve(fn(req, res)).catch((error: any) => {
            if (error instanceof Error) {
                res.json({ message: error.message, result: null, success: false })
                return;
            }
            res.json({ message: "Something went wrong", result: null, success: false })
        });
    };
};
 