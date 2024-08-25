import { Logging } from "@/logs";
import {  METADATA_KEYS } from "@helpers/constants";
import helpers from "@helpers/index";
import { InitializeCronJobs } from "@services/Scheduler";
import { CronExpression } from "../types/cron-expression.interface";

export const CronJob = (cronExpression: keyof typeof CronExpression, name?: string | null) => {
    if (name === null || !name) {
        name = 'CRON:' + helpers.randomNumber()
    }
    return (target: any, key: string, descriptor: any) => {
        const original = descriptor.value;
        Logging.dev(`Cron Job added for : ${target.constructor.name}-${key}`, "notice")
        Reflect.defineMetadata(METADATA_KEYS.CRONJOB, CronExpression[cronExpression], target, key);

        InitializeCronJobs(target.constructor)
        descriptor.value = function (...args: any[]) {
            return original(...args)
        }
    }
}
