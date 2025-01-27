import type { __CONFIG__ } from "@/app/config";
import { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { Server } from "socket.io";
import type { CustomResponse } from "../interfaces";
import type { FileHandler } from "../interfaces/fileupload.interface";
import type { IUser } from "../interfaces/user.interface";
export type Type<C extends object = object> = new (...args: any) => C;

export type AppConfig = typeof __CONFIG__;
type ENV = {
	APP_ENV: string;
	API_KEY: number;
	APP_PORT: string;
	APP_DOMAIN: string;
	API_VERSION: string;
	ALLOWED_PRIMARY_DOMAINS: string | `${string},${string}`[];
	SALT: string;
	APP_SECRET: string;
	JWT_SECRET_TOKEN: string;
	COOKIE_SECRET: string;
	SESSION_SECRET: string;
	MAIL_TEMPLATE_PATH: string;
	CACHE_ENBALED: string;
	CLUSTERS: string;
	CACHE_HOST: string;
	CACHE_PORT: string;
	DATABASE_URL: string;
	DB_DIALECT: "postgres" | "mysql" | "sqlite";
	DB_NAME: string;
	DB_HOST: string;
	DB_USER: string;
	DB_PASS: string;
	DB_PORT: string;
	SMTP_HOST: string;
	SMTP_HOST_USER: string;
	SMTP_HOST_PASS: string;
	SMTP_HOST_PORT: string;
	SMTP_TYPE: string;
	SMTP_SENDER_NAME: string;
};
declare global {
	namespace Express {
		interface Application {
			enableHooks: () => void;
			event: (event: Events, callback: () => void) => void;
		}
		export interface Request {
			session: {
				user?: (IUser & JwtPayload) | null;
				[key: string]: any;
			};
			io?: Server;
			files?: FileHandler[] | FileHandler;
			isAuthenticated?: boolean;
			user?: IUser;
			clientSecret?: string | null;
		}
		export interface Response {
			json: (data: CustomResponse) => this;
		}
	}
	namespace NodeJS {
		interface ProcessEnv extends ENV {}
	}
}
