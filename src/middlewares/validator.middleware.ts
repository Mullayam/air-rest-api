import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { FileValidationArgs, FileValidationOptions } from "@/utils/interfaces/file-validator.interface";
import { FileHandler } from "@/utils/interfaces/fileupload.interface";

export class Validator {
    /**
 * Executes validations for the given request using an array of validation objects.
 *
 * @param {any[]} validations - Array of validation objects.
 * @return {Promise<void>} Promise that resolves if validations pass, otherwise returns a JSON error response.
 */
    static forFeature(validations: any[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            for (let validation of validations) {
                const result = await validation.run(req);
                if (result.errors.length) break;
            }
            // Execute all validations
            // await Promise.all(validations.map(validation => validation.run(req)));
            const errors = validationResult(req);
            const err = errors.formatWith(x => x.msg).array()
            if (errors.isEmpty()) {
                return next();
            }
            return res.status(422).json({ message: "Validation Error", result: err, success: false })
        };
    }

}
