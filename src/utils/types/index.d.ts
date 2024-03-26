import { CONFIG } from '@/app/config';
import { Request, Send } from 'express'
import { JwtPayload } from "jsonwebtoken";
import { TemplateOptions } from 'nodemailer-express-handlebars';
import { UploadedFile } from 'express-fileupload';
export type Type<C extends object = object> = new (...args: any) => C;
export type AppConfig = typeof CONFIG
declare global {
    namespace Express {
        export interface Request {
            session: {
                user?: UserInfoJwtPayload
                admin?: AdminJwtPayload
                driver?: DriverJwtPayload
                [key: string]: any
            },
            files?: fileUpload.FileArray | null | undefined;
        }
    }
}
interface UserInfoJwtPayload {
    uid?: string,
    email?: string,
    role?: string,
    status?: string,
}

export interface AdminJwtPayload extends JwtPayload {
    aid: string
    fullname: string
    username: string
    email: string
    status: string
    role: string
}
export interface DriverJwtPayload extends JwtPayload {
    "aid": string
    "fullname": string
    "status": string
    "role": string
}
export interface ResponseHandler extends Response {
    json: CustomResponse;
}
interface CustomResponse {
    success: boolean;
    message: string;
    result: null | Record<string, any>
    [key: string]: any
}
export interface IUser {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    residence: string;
    avatar: string;
    email: string;
    password: string;
    role: IRole;
    isEmailVerified: boolean;
    isProfileCompleted: boolean;
}
export type LoggingLevel = "emerg" | "alert" | "crit" | "error" | "notice" | "info" | "debug"
export type StorageType = "Redis" | "Memory" | "Disk"
export type LoggingOptions = {
    file: {
        level: string;
        filename: string;
        handleExceptions: boolean;
        json: boolean;
        maxsize: number;
        maxFiles: number;
        colorize: boolean;
    };
    console: {
        level: string;
        handleExceptions: boolean;
        json: boolean;
        colorize: boolean;
        format: winston.Logform.Format;
    };
}
export interface InterceptorsSettings {
    response: Record<string, any>;
    isEnable?: boolean;
}
export interface HttpStatusName {
    OK: number;
    CREATED: number;
    ACCEPTED: number;
    ACCEPTED: number;
    NO_CONTENT: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    DUPLICATE: number;
    INTERNAL_SERVER_ERROR: number;

}
export interface HttpExceptionParams {
    name: keyof HttpStatusCodes;
    message: string;
    stack?: string | any
}
export type HttpStatusCodes = {
    "FOUND": 302,
    "SEE_OTHER": 303,
    "NOT_MODIFIED": 304,
    "TEMPORARY_REDIRECT": 307,
    "RESUME_INCOMPLETE": 308,
    "OK": 200,
    "CREATED": 201,
    "ACCEPTED": 202,
    "NON_AUTHORITATIVE_INFORMATION": 203,
    "NO_CONTENT": 204,
    "RESET_CONTENT": 205,
    "PARTIAL_CONTENT": 206,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "METHOD_NOT_ALLOWED": 405,
    "REQUEST_TIMEOUT": 408,
    "CONFLICT": 409,
    "GONE": 410,
    "LENGTH_REQUIRED": 411,
    "PRECONDITION_FAILED": 412,
    "PAYLOAD_TOO_LARGE": 413,
    "REQUESTED_RANGE_NOT_SATISFIABLE": 416,
    "TOO_MANY_REQUESTS": 429,
    "CLIENT_CLOSED_REQUEST": 499,
    "INTERNAL_SERVER_ERROR": 500,
    "BAD_GATEWAY": 502,
    "SERVICE_UNAVAILABLE": 503,
    "GATEWAY_TIMEOUT": 504,
}

export interface MailOptions {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html: string;
}
export type MailOptionsWithTemplate = MailOptions & TemplateOptions

export interface FileHandler extends UploadedFile {
    name: string;
    /** A function to move the file elsewhere on your server */
    mv(path: string, callback: (err: any) => void): void;
    mv(path: string): Promise<void>;
    /** Encoding type of the file */
    encoding: string;
    /** The mimetype of your file */
    mimetype: string;
    /** A buffer representation of your file, returns empty buffer in case useTempFiles option was set to true. */
    data: Buffer;
    /** A path to the temporary file in case useTempFiles option was set to true. */
    tempFilePath: string;
    /** A boolean that represents if the file is over the size limit */
    truncated: boolean;
    /** Uploaded size in bytes */
    size: number;
    /** MD5 checksum of the uploaded file */
    md5: string;
}
export interface AuthProviders {
    [key: AuthProvidersList]: AuthProvidersKeys
}
export interface AuthProvidersScopes {
    [key: AuthProvidersList]: string[];

}
export interface AuthProvidersKeys {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
};
export type AuthProvidersList = "google" | "facebook" | "github"