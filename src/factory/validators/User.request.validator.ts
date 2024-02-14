import { ExpressValidator } from 'express-validator';
const myExpressValidator = new ExpressValidator();
const { query, body } = myExpressValidator;

export const UserRefreshTokenValidator = () => query('token').isString().notEmpty().withMessage('Please Provide Token query string');


export const UserReqValidator = {
    test: [
        body('phone').isString().isLength({ min: 10, max: 10 }).withMessage('Mobile number should be 10 digits').notEmpty().withMessage('Please Provide Mobile Number'),
    ],
    
}