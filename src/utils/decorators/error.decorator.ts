import { Request, Response, NextFunction } from 'express';

/**
* A decorator function that handles the case when a requested resource is not found.
*
* @param {Request} req - The request object.
* @param {Response} res - The response object.
* @param {NextFunction} next - The next middleware function.
* @return {void} No return value.
*/
export function NotFound() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            return res.status(404).send({ error: "NOT FOUND", code: 404, message: "Content Not Found", stack: { info: "The page you are looking for does not exist", path: req.url } });
        };

        return descriptor;
    };
}

/**
* A decorator function that handles the case when a bad request is made.
*
* @param {any} target - The target object.
* @param {string} propertyKey - The property key.
* @param {PropertyDescriptor} descriptor - The property descriptor.
* @return {PropertyDescriptor} The updated property descriptor.
*/
export function BadRequest() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            return res.status(400).send({ error: "BAD REQUEST", code: 400, message: "Bad Request - Cannot process", stack: { info: "Bad Request - Api mapping doest not Support this ", path: req.url } });

        };

        return descriptor;
    };
}


/**
 * A decorator function that handles the case when a server error occurs.
 *
 * @return {Function} A function that takes in a target, propertyKey, and descriptor as parameters.
 * This function returns a function that takes in a request, response, and next function as parameters.
 * This inner function sets the response status to 500 and sends a JSON object with the error message, code, and stack information.
 */
export function ServerError() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        descriptor.value = function (req: Request, res: Response, next: NextFunction) {
            return res.status(500).send({ error: "INTERNAL SERVER ERROR", code: 500, message: "Application Error", stack: { info: "Something went wrong", path: req.url } });
        };

        return descriptor;
    };
}
