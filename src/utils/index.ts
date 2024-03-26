import bcrypt from "bcryptjs";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
import jwt from 'jsonwebtoken'
 
import * as crypto from 'crypto';
import { CONFIG } from "@/app/config";

class Utils {
    async HashPassword(PasswordStr: string): Promise<string> {
        return bcrypt.hashSync(PasswordStr, salt);
    }
    async ComparePassword(HashedPassword: string, Password: string): Promise<boolean> {
        return bcrypt.compareSync(Password, HashedPassword);
    }
    signJWT(payload: any): string {
        
        return jwt.sign(payload, CONFIG.SECRETS.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });
    }
    verifyJWT(token: string): any {
        return jwt.verify(token, CONFIG.SECRETS.JWT_SECRET_KEY);
    }
    decodeToken(token: string): any {
        return jwt.decode(token);
    }
    randomToken(length: number = 64): string {
        return crypto.randomBytes(length).toString('hex');
    }

}
export default new Utils()