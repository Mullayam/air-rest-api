import bcrypt from "bcryptjs";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class Utils {
    HashPassword(PasswordStr: string): string {
        return bcrypt.hashSync(PasswordStr, salt);
    }
    ComparePassword(HashedPassword: string, Password: string): boolean {
        return bcrypt.compareSync(Password, HashedPassword);

    }
     
    
}
export default new Utils()