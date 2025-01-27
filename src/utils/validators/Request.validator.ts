import { body } from "express-validator";

export const UserReqValidator = {
	test: [
		body("phone")
			.isString()
			.isLength({ min: 10, max: 10 })
			.withMessage("Mobile number should be 10 digits")
			.notEmpty()
			.withMessage("Please Provide Mobile Number"),
	],
};
