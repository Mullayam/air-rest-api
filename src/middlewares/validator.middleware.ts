import type { Request, Response, NextFunction } from "express";
import FileValidator from '@/utils/validators/File.validator'
import { validationResult } from "express-validator";
import { FileValidationArgs, FileValidationOptions } from "@/utils/types/file-validator.interface";
import { FileHandler } from "@/utils/types/fileupload.interface";

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
    static forFile(args: FileValidationArgs[],
        options?: FileValidationOptions) {
        return async (req: Request, res: Response, next: NextFunction) => {
        
            const files = []
            if (req.files === null || !req.files) {
                return next()
            }
            if (Array.isArray(req.files)) {
                files.push(...req.files)
            } else {
                const fields = Object.keys(req.files)
                const minRequired =
                    options?.minFieldsRequired ?? fields.length

                if (minRequired > fields.length) {
                    return res.status(400).json({
                        message: `Any of the ${minRequired} files are required.`,
                        result: {
                            requiredFields: args.map((item) => ({
                                field: item.field,
                                allowedMimeTypes: item.allowedMimeTypes
                            }))
                        },
                        success: false,
                    })
                }

                for (const { field, strict = true } of args) {
                    if (req.files[field]) {
                        const fieldFiles = req.files[field]
                        const isNotArray = !Array.isArray(fieldFiles)

                        if (isNotArray && strict) {
                            return res.status(400).json({
                                message: `File ${field} is required.`,
                                result: null,
                                success: false,
                            })
                        }

                        if (!isNotArray) {
                            files.push(fieldFiles)
                        }
                    }
                }
            }

            for (const file of files) {
                const validation = args.find(
                    (arg) => arg.field === String(file.fieldname)
                )
                if (!validation) {
                    return res
                        .status(400)
                        .json({
                            message: 'Invalid file field',
                            result: null,
                            success: false,
                        })
                }

                const result = await FileValidator.validateMimeType(
                    file.buffer,
                    validation?.allowedMimeTypes
                )

                if (!result.isValid) {
                    return res
                        .status(400)
                        .json({ message: 'Invalid file type.', result ,success: false})
                }
            }

            return next()
        }
    }
}
