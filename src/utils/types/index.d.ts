import { CONFIG } from "@/app/config";
import { Request, Response, NextFunction, Send } from "express";

import { JwtPayload } from "jsonwebtoken";
import { TemplateOptions } from "nodemailer-express-handlebars";
import { FileHandler } from '../interfaces/fileupload.interface';
import fileUpload from "express-fileupload";
export type Type<C extends object = object> = new (...args: any) => C;
export type AppConfig = typeof CONFIG;
export interface ExpressMiddleware {
    activate(req: Request, res: Response, next: NextFunction): void;
}
type Events = "ready" | "error" | "mount";
declare global {
    namespace Express {
        interface Application {
            enableHooks: () => void;
            event: (event: Events, callback: () => void) => void;
          }
        export interface Request {
            session: {
                user?: UserInfoJwtPayload;
                [key: string]: any;
            };
            files?: FileUploadInfo | FileUploadInfo;
            // uploadedFiles: FileUploadInfo[];
            isAuthenticated?: boolean;
            user?: IUser;
            clientSecret?: string;
        }
    }
    
}

export type FileUploadInfo = {
    id: string;
    key: string;
    extenstion: string;
} & FileHandler;
interface IUser {
    uid?: string;
    email?: string;
    role?: string;
    status?: string;
}

export interface ResponseHandler extends Response {
    json: CustomResponse;
}
interface CustomResponse {
    success: boolean;
    message: string;
    result: null | Record<string, any>;
    [key: string]: any;
}

export interface InterceptorsSettings {
    response: Record<string, any>;
    isEnable?: boolean;
}
