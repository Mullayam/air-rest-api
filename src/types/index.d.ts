import { JwtPayload } from "jsonwebtoken";

interface UserInfoJwtPayload {
    id?: string,
    email?: string,
    role?: string,
    status?: string,
}
export interface LoginResponse {
    Token: string
    RefreshToken: string
}
export interface MailOptionsInterface {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html: string;
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
type IRole = {}
export type IResponse<Res> = {
    message: string;
    data: {

    };
};

export type LoggingLevel = "emerg" | "alert" | "crit" | "error" | "notice" | "info" | "debug"
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
    stack?: string
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
    "INTEMAL_SERVER_ERROR": 500,
    "BAD_GATEWAY": 502,
    "SERVICE_UNAVAILABLE": 503,
    "GATEWAY_TIMEOUT": 504,
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