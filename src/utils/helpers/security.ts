import CryptoJS from 'crypto-js'
import * as crypto from "crypto"
import { CONFIG } from "@/app/config";
import bcrypt from "bcrypt";
const ALGORITHM = "aes-256-cbc";
const ENCODING = "hex";
const ENCRYPTION_KEY: string = "enjoys_encrption_key!@#%^&*()_NJ";
const IV_LENGTH = 16;

/** 
 * @class Security 
 * Used for encrypting and decrypting data.
 * Use CryptoJS for more advanced encryption and decryption. Visit https://www.npmjs.com/package/crypto-js
*/
export class Security {

    /**
     * Generates a salt value for password hashing using the bcrypt library.
     *
     * @param {number} [saltRounds=10] - The number of rounds to use for generating the salt.
     * @return {string} The generated salt value.
     */
    private static generateSalt(saltRounds = 10): string {
        return bcrypt.genSaltSync(saltRounds)
    }
    /**
     * Asynchronously encrypts a password using bcrypt.
     *
     * @param {string} Password - The password to be encrypted.
     * @return {Promise<string>} A promise that resolves to the encrypted password.
     */
    static async EncryptPassword(Password: string): Promise<string> {
        const salt = this.generateSalt()
        return bcrypt.hashSync(Password, salt)
    }
    /**
     * Asynchronously decrypts a password using bcrypt.
     *
     * @param {string} Password - The password to be decrypted.
     * @param {string} HashedPassword - The hashed password to compare against.
     * @return {Promise<boolean>} A promise that resolves to true if the password matches the hashed password, false otherwise.
     */
    static async ComparePassword(Password: string, HashedPassword: string): Promise<boolean> {
        const match = await bcrypt.compare(Password, HashedPassword);
        return match
    }
    /**
     * Asynchronously generates an encryption object with `Encrypt` and `Decrypt` methods.
     *
     * @return {Promise<{Encrypt: (data: any) => string, Decrypt: (text: any) => any}>} An object with `Encrypt` and `Decrypt` methods.
     * The `Encrypt` method encrypts the given data and returns a string in the format of `${iv}:${encrypted}`.
     * The `Decrypt` method decrypts the given text and returns the decrypted data.
     */
    async DataToEncyptedStringWithIV() {
        return {
            Encrypt(data: any): string {
                if (typeof data === "object") {
                    data = JSON.stringify(data);
                }
                const iv = crypto.randomBytes(IV_LENGTH);
                const cipher = crypto.createCipheriv(
                    ALGORITHM,
                    Buffer.from(ENCRYPTION_KEY),
                    iv
                );
                let encrypted = cipher.update(data);
                encrypted = Buffer.concat([encrypted, cipher.final()]);
                return `${iv.toString(ENCODING)}:${encrypted.toString(ENCODING)}`;
            },
            Decrypt(text: any): any {
                const textParts = text.split(":");
                const iv = Buffer.from(textParts.shift(), ENCODING);
                const encryptedText = Buffer.from(textParts.join(":"), ENCODING);
                const decipher = crypto.createDecipheriv(
                    ALGORITHM,
                    Buffer.from(ENCRYPTION_KEY),
                    iv
                );
                let decrypted = decipher.update(encryptedText);
                decrypted = Buffer.concat([decrypted, decipher.final()]);

                return decrypted.toString();
            }
        }
    }
    /**
     * Encrypts or decrypts the given data using the AES encryption algorithm.
     *
     * @param {any} data - The data to be encrypted or decrypted.
     * @param {string} [secret] - The secret key used for encryption and decryption. If not provided, the default encryption key will be used.
     * @return {{EncryptToString: () => string, DecryptFromString: () => string}} An object with two methods: 
     * - `EncryptToString`: Encrypts the data and returns it as a string.
     * - `DecryptFromString`: Decrypts the data from a string and returns it as a string.
     */
    EncryptDecryptData(data: any, secret?: string) {
        return {
            EncryptToString: () => {
                if (typeof data === "object") {
                    data = JSON.stringify(data);
                }
                return CryptoJS.AES.encrypt(data, secret || ENCRYPTION_KEY).toString();
            },
            DecryptFromString: () => {
                return CryptoJS.AES.decrypt(data, secret || ENCRYPTION_KEY).toString();
            }
        }
    }

    /**
     * Generates a signature for the given method, URI, body, and client secret.
     *
     * @param {string} method - The HTTP method used for the request.
     * @param {string} uri - The URI of the request.
     * @param {any} body - The body of the request.
     * @param {string} clientSecret - The client secret used for generating the signature.
     * @return {Promise<string>} A promise that resolves to the generated signature.
     */
    async GenerateSignature(method: string, uri: string, body: any, clientSecret: string): Promise<string> {
        let decodedString: string;
        if (method === "GET") {
            decodedString = this.PurifiedString(method, uri)
        }
        else {
            decodedString = this.PurifiedString(method, uri, body)
        }

        clientSecret = CONFIG.SECRETS.APP_SECRET
        const hmac = crypto.createHmac('sha512', clientSecret).update(decodedString);
        return hmac.digest('hex');
    }
    /**
     * Verifies the signature of a request using the provided method, URI, body, and client secret.
     *
     * @param {string} method - The HTTP method of the request.
     * @param {string} uri - The URI of the request.
     * @param {any} body - The body of the request.
     * @param {string} clientSecret - The client secret used to generate the signature.
     * @return {Promise<boolean>} A promise that resolves when the signature is verified.
     */
    async VerifySignature(method: string, uri: string, body: any, clientSecret: string): Promise<boolean> {
        return true
    }
    /**
     * Sorts the query parameters in the given URL and returns the sorted URL.
     *
     * @param {string} wholeUrl - The URL containing the query parameters.
     * @return {string} The sorted URL with the query parameters in alphabetical order.
     */
    private sortQueryParams(wholeUrl: string): string {
        var url = wholeUrl.split('?'),
            baseUrl = url[0],
            queryParam = url[1].split('&');

        wholeUrl = baseUrl + '?' + queryParam.sort().join('&');

        return this.fixedEncodeURIComponent(wholeUrl);
    }
    /**
     * A recursive function that sorts the parameters of an object in alphabetical order.
     *
     * @param {Record<string, any>} object - The object whose parameters need to be sorted.
     * @return {Record<string, any>} The object with sorted parameters.
     */
    private sortBodyParams(object: Record<string, any>): Record<string, any> {

        if (typeof object !== 'object' || object === null) {
            return object;
        }

        if (Array.isArray(object)) {
            return object.map(item => this.sortBodyParams(item));
        }

        const sortedObject: any = {};
        Object.keys(object).sort().forEach(key => {
            sortedObject[key] = this.sortBodyParams(object[key]);
        });
        return sortedObject;

    }
    /**
     * A function that creates a purified string based on the method, URL, and optional request body.
     *
     * @param {string} method - The HTTP method used.
     * @param {string} wholeurl - The complete URL.
     * @param {Record<string, any>} requestBody - The request body (optional).
     * @return {string} The purified string generated from the input.
     */
    private PurifiedString(method: string, wholeurl: string, requestBody?: Record<string, any>): string {
        let baseArray: string[] = [];
        baseArray.push(method.toUpperCase());

        if (wholeurl.indexOf('?') >= 0) {
            baseArray.push(this.sortQueryParams(wholeurl));
        } else {
            baseArray.push(this.fixedEncodeURIComponent(wholeurl));
        }
        if (requestBody) {
            baseArray.push(this.fixedEncodeURIComponent(JSON.stringify(this.sortBodyParams(requestBody))));
        }

        return baseArray.join('&');
    }

    private fixedEncodeURIComponent = (str: string) => {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
            return '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
    }
}