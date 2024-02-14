import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
export class Validator {
    static forFeature(validations: any[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            for (let validation of validations) {
                const result = await validation.run(req);
                if (result.errors.length) break;  
            }
            const errors = validationResult(req);
            const err = errors.formatWith(x => x.msg).array()         
            if (errors.isEmpty()) {
                return next();
            }
            res.status(400).json({ message: "result", result: err, success: false })
        };
    }
}