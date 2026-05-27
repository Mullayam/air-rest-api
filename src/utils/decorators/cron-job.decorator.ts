import { Logging } from "@/logs";
import { METADATA_KEYS } from "@/utils/helpers/constants";
import helpers from "@/utils/helpers/index";
import { InitializeCronJobs } from "@/utils/services/cron/scheduler";
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

		// Defer cron initialization to next tick so all decorators are applied first
		if (!target.constructor.__cronInitialized) {
			target.constructor.__cronInitialized = true;
			process.nextTick(() => {
				try {
					InitializeCronJobs(target.constructor);
				} catch (error: any) {
					Logging.dev(`Failed to initialize cron jobs: ${error.message}`, "error");
				}
			});
		}

		descriptor.value = function (...args: any[]) {
			return original.apply(this, args);
		};

		return descriptor;
	};
};
