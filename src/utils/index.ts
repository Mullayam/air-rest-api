import bcrypt from "bcryptjs";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
import jwt from 'jsonwebtoken'
import { CONFIG } from "@/app/config";

class Utils {
    /**
     * @function HashPassword
     * @description Hashes a given password string using Bcrypt.
     * @param {string} PasswordStr - The password string to hash.
     * @return {Promise<string>} - The hashed password string.
     */
    async HashPassword(PasswordStr: string): Promise<string> {
        return bcrypt.hashSync(PasswordStr, salt);
    }

    /**
     * Compares a hashed password with a plain-text password to check for a match.
     *
     * @param {string} HashedPassword - The hashed password to compare against.
     * @param {string} Password - The plain-text password to verify.
     * @return {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
     */
    async ComparePassword(HashedPassword: string, Password: string): Promise<boolean> {
        return bcrypt.compareSync(Password, HashedPassword);
    }
    /**
     * Signs a JSON Web Token (JWT) with the given payload and key ID.
     *
     * @param {any} payload - The payload to include in the JWT.
     * @param {string} kid - The key ID to include in the JWT header.
     * @return {string} The signed JWT as a string.
     */
    signJWT(payload: any, kid: string): string {
        return jwt.sign(payload, CONFIG.SECRETS.JWT_SECRET_KEY, {
            expiresIn: '7d',
            issuer: "ENJOYS",
            header: {
                alg: "HS256",
                typ: "JWT",
                kid,
            }
        });
    }



    /**
     * @function verifyJWT
     * @description Verifies the given JWT token string against the app's secret key.
     * @param {string} token - The JWT token string to verify.
     * @param {jwt.VerifyOptions} [options] - An object containing verify options.
     * @return {any} The decoded payload.
     */
    verifyJWT(token: string, options?: jwt.VerifyOptions): any {
        return jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY, options);
    }

    /**
     * @function decodeToken
     * @description Decodes the given JWT token string and returns the decoded payload.
     * @param {string} token - The JWT token string to decode.
     * @return {any} The decoded payload.
     */
    decodeToken(token: string): any {
        return jwt.decode(token);
    }


}
export default new Utils()