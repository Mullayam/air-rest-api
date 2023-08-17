import bcrypt from "bcryptjs";
import { customRandom, random } from "nanoid";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class Utils {
    HashPassword(PasswordStr: string): string {
        return bcrypt.hashSync(PasswordStr, salt);
    }
    ComparePassword(HashedPassword: string, Password: string): boolean {
        return bcrypt.compareSync(Password, HashedPassword);

    }
    CreateUserID(): string {
        const id = customRandom("0123456789", 8, random)        
        return id()
    }
    
}
export default new Utils()