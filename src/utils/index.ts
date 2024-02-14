import bcrypt from "bcryptjs";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "./helpers/constants";
import * as crypto from 'crypto';

class Utils {
    async HashPassword(PasswordStr: string): Promise<string> {
        return bcrypt.hashSync(PasswordStr, salt);
    }
    async ComparePassword(HashedPassword: string, Password: string): Promise<boolean> {
        return bcrypt.compareSync(Password, HashedPassword);
    }
    signJWT(payload: any): string {
        console.log(JWT_SECRET)
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: '7d'
        });
    }
    verifyJWT(token: string): any {
        return jwt.verify(token, JWT_SECRET);
    }
    decodeToken(token: string): any {
        return jwt.decode(token);
    }
    randomToken(length: number = 64): string {
        return crypto.randomBytes(length).toString('hex');
    }

}
export default new Utils()