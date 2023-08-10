declare module 'module-alias/register'
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
export interface HttpStatus {
    OK: number;
    CREATED: number;
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
    name?: string, message: string, stack?: string
}