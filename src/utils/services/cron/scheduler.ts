import cron from 'node-cron'
import { CronExpression  } from '@utils/types/cron-expression.interface'
import { METADATA_KEYS } from '@utils/helpers/constants'
export class Scheduler {
    private static _instance: Scheduler
    private constructor() { }
    public static forRoot(): Scheduler {
        if (!Scheduler._instance) {
            Scheduler._instance = new Scheduler()
        }
        return Scheduler._instance
    }
    addJob(cronExpression: CronExpression, callback: () => void, options?: cron.ScheduleOptions): cron.ScheduledTask {

        return cron.schedule(cronExpression, callback, options)
    }
    getJobs(): Map<string, cron.ScheduledTask> {
        return cron.getTasks()
    }
    validate(cronExpression: string): boolean {
        return cron.validate(cronExpression)
    }

}
export function InitializeCronJobs(targetClass: any) {
    const methods = Object.getOwnPropertyNames(targetClass.prototype);
    methods.forEach(methodName => {
        const cronSchedule = Reflect.getMetadata(METADATA_KEYS.CRONJOB, targetClass.prototype, methodName);
        if (cronSchedule) {
            cron.schedule(cronSchedule, targetClass.prototype[methodName]);
            console.log(`Cron job scheduled for method ${methodName} with schedule ${cronSchedule}`);
        }
    });
}
