import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Middlewares } from "./app.middlewares.js";

export const SECRET_KEY: Secret = process.env.JWT_SECRET_TOKEN as string
export interface CustomRequest extends Request {
    token: string | JwtPayload;
}
export class RoutesMiddleware extends Middlewares {

}