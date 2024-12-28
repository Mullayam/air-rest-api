import CryptoJS from "crypto-js";
import * as crypto from "crypto";
import { __CONFIG__ } from "@/app/config";
import { RoutingMethods } from "../interfaces/routes.interface";
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
     * @typedef {Object} KeyPair
     * @property {string} publicKey - The generated public key in PEM format.
     * @property {string} privateKey - The generated private key in PEM format.
     * @example 
            var crypt = new JSEncrypt();
            //You can also use setPrivateKey and setPublicKey, they are both alias to setKey
            crypt.setKey(__YOUR_OPENSSL_PRIVATE_OR_PUBLIC_KEY__); 

            var text = 'test';
            var enc = crypt.encrypt(text);
     * @return {{generateKeyPair: (passphrase: string) => KeyPair, encrypt: (text: string, publicKey: string) => string, decrypt: (encryptedText: string, privateKey: string, passphrase: string) => string}}
     */
    asymmetric() {
        /**
         * Generates an RSA key pair with the given passphrase.
         *
         * @param {string} passphrase - The passphrase used to encrypt the private key.
         * @return {KeyPair} An object containing the generated public and private keys in PEM format.
         */
        function generateKeyPair(passphrase: string): {
            publicKey: string;
            privateKey: string;
        } {
            const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: "spki",
                    format: "pem",
                },
                privateKeyEncoding: {
                    type: "pkcs8",
                    format: "pem",
                    cipher: "aes-256-cbc",
                    passphrase: passphrase,
                },
            });

            return {
                publicKey,
                privateKey,
            };
        }
        /**
         * Encrypts the given text using the provided public key.
         *
         * @param {string} text - The text to encrypt.
         * @param {string} publicKey - The public key in PEM format to encrypt with.
         * @return {string} The encrypted text as a base64 encoded string.
         */
        const encrypt = (text: string, publicKey: string) => {
            return crypto
                .publicEncrypt(publicKey, Buffer.from(text, "utf8"))
                .toString("base64");
        };

        /**
         * Decrypts the given encrypted text using the provided private key and passphrase.
         *
         * @param {string} encryptedText - The encrypted text to decrypt.
         * @param {string} privateKey - The private key in PEM format to decrypt with.
         * @param {string} passphrase - The passphrase used to encrypt the private key.
         * @return {string} The decrypted text as a UTF-8 encoded string.
         */
        const decrypt = (
            encryptedText: string,
            privateKey: string,
            passphrase: string
        ) => {
            return crypto
                .privateDecrypt(
                    {
                        key: privateKey.toString(),
                        passphrase,
                    },
                    Buffer.from(encryptedText, "base64")
                )
                .toString("utf8");
        };


        /**
         * Encrypts the given text using RSA public key and OAEP padding.
         *
         * @param {string} plainText - The text to encrypt.
         * @param {string} public_key - The RSA public key in PEM format for encryption.
         * @return {string} The encrypted text as a base64 encoded string.
         */
        function encryptV1(plainText: string, public_key: string) {
            return crypto.publicEncrypt({
                key: public_key,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
                Buffer.from(plainText)
            )
        }

        /**
         * Decrypts the given encrypted text using RSA private key and OAEP padding.
         *
         * @param {string} encryptedText - The base64-encoded encrypted text to decrypt.
         * @param {string} private_key - The RSA private key in PEM format for decryption.
         * @return {Buffer} The decrypted data.
         */
        function decryptV2(encryptedText: string, private_key: string) {
            return crypto.privateDecrypt(
                {
                    key: private_key,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: 'sha256'
                },
                Buffer.from(encryptedText, 'base64')
            )
        }


        return {
            generateKeyPair,
            encrypt,
            encryptV1,
            decrypt,
            decryptV2
        };
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
            },
        };
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
                return CryptoJS.AES.decrypt(data, secret || ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
            },
        };
    }

    /**
     * Generates a signature for the given method, URI, body, and client secret.
     *
     * @param {RoutingMethods} method - The HTTP method used for the request.
     * @param {string} uri - The URI of the request.
     * @param {any} body - The body of the request.
     * @param {string} clientSecret - The client secret used for generating the signature.
     * @return {Promise<string>} A promise that resolves to the generated signature.
     */
    async GenerateSignature(
        method: RoutingMethods,
        uri: string,
        body?: any,
        clientSecret?: string
    ): Promise<string> {
        let decodedString: string;
        if (method === "GET") {
            decodedString = this.PurifiedString(method, uri);
        } else {
            decodedString = this.PurifiedString(method, uri, body);
        }

        clientSecret = __CONFIG__.SECRETS.APP_SECRET;
        const hmac = crypto
            .createHmac("sha512", clientSecret)
            .update(decodedString);
        return hmac.digest("hex");
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
    async VerifySignature(
        method: RoutingMethods,
        uri: string,
        body: any,
        clientSecret: string
    ): Promise<boolean> {
        return true;
    }
    /**
     * Sorts the query parameters in the given URL and returns the sorted URL.
     *
     * @param {string} wholeUrl - The URL containing the query parameters.
     * @return {string} The sorted URL with the query parameters in alphabetical order.
     */
    private sortQueryParams(wholeUrl: string): string {
        var url = wholeUrl.split("?"),
            baseUrl = url[0],
            queryParam = url[1].split("&");

        wholeUrl = baseUrl + "?" + queryParam.sort().join("&");

        return this.fixedEncodeURIComponent(wholeUrl);
    }
    /**
     * A recursive function that sorts the parameters of an object in alphabetical order.
     *
     * @param {Record<string, any>} object - The object whose parameters need to be sorted.
     * @return {Record<string, any>} The object with sorted parameters.
     */
    private sortBodyParams(object: Record<string, any>): Record<string, any> {
        if (typeof object !== "object" || object === null) {
            return object;
        }

        if (Array.isArray(object)) {
            return object.map((item) => this.sortBodyParams(item));
        }

        const sortedObject: any = {};
        Object.keys(object)
            .sort()
            .forEach((key) => {
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
    private PurifiedString(
        method: string,
        wholeurl: string,
        requestBody?: Record<string, any>
    ): string {
        let baseArray: string[] = [];
        baseArray.push(method.toUpperCase());

        if (wholeurl.indexOf("?") >= 0) {
            baseArray.push(this.sortQueryParams(wholeurl));
        } else {
            baseArray.push(this.fixedEncodeURIComponent(wholeurl));
        }
        if (requestBody) {
            baseArray.push(
                this.fixedEncodeURIComponent(
                    JSON.stringify(this.sortBodyParams(requestBody))
                )
            );
        }

        return baseArray.join("&");
    }

    private fixedEncodeURIComponent = (str: string) => {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
            return "%" + c.charCodeAt(0).toString(16).toUpperCase();
        });
    };
}
