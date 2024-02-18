import cron from 'node-cron'
import { CronExpression } from '@helpers/constants'
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