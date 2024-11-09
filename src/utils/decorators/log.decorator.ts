import { Logging } from "@/logs";
import { LoggingLevel } from "../interfaces/logs.interface";
import { yellow } from "colorette";

export const Log = (message: string, type: LoggingLevel = "info") => {
    return (target: any, key: string, descriptor: any) => {
        const original = descriptor.value;
        
        descriptor.value = function (...args: any[]) {
            Logging.dev(`${yellow(`[${key}]`)} ${message}`, type)
        }
    }
}