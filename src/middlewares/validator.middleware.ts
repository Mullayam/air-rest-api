import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export class Validator {
	/**
	 * Executes validations for the given request using an array of validation objects.
	 *
	 * @param {any[]} validations - Array of validation objects.
	 * @return {Promise<void>} Promise that resolves if validations pass, otherwise returns a JSON error response.
	 */
	static forFeature(validations: any[]) {
		return async (req: Request, res: Response, next: NextFunction) => {
			for (const validation of validations) {
				await validation.run(req);
			}

			const errors = validationResult(req);
			const err = errors
				.formatWith((x) => x.msg)
				.array()
				.filter((x) => x !== "Invalid value");
			if (errors.isEmpty()) {
				return next();
			}
			res
				.status(422)
				.json({ message: "Validation Error", result: err, success: false });
			return;
		};
	}
}
