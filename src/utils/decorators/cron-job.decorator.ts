import { Logging } from "@/logs";
import { METADATA_KEYS } from "@helpers/constants";
import helpers from "@helpers/index";
import { InitializeCronJobs } from "@services/cron/scheduler";
import { CronExpression } from "../interfaces/cron-expression.interface";

export const CronJob = (
	cronExpression: keyof typeof CronExpression,
	name?: string | null,
) => {
	if (name === null || !name) {
		name = `CRON:${helpers.RandomNumber()}`;
	}
	return (target: any, key: string, descriptor: any) => {
		const original = descriptor.value;
		Logging.dev(
			`Cron Job added for : ${target.constructor.name}-${key}`,
			"notice",
		);
		Reflect.defineMetadata(
			METADATA_KEYS.CRONJOB,
			CronExpression[cronExpression],
			target,
			key,
		);

		if (!target.constructor.__cronInitialized) {
            try {
                InitializeCronJobs(target.constructor);
                target.constructor.__cronInitialized = true;
            } catch (error:any) {
                Logging.dev(`Failed to initialize cron jobs: ${error.message}`, "error");
            }
        }

		descriptor.value = (...args: any[]) => original(...args);
	};
};
