import { Logging } from "@/logs";
import { yellow } from "colorette";
import type { LoggingLevel } from "../interfaces/logs.interface";

export const Log = (message: string, type: LoggingLevel = "info") => {
	return (target: any, key: string, descriptor: any) => {
		const original = descriptor.value;

		descriptor.value = (...args: any[]) => {
			Logging.dev(`${yellow(`[${key}]`)} ${message}`, type);
		};
	};
};
