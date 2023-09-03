import { Application } from "express";
import { Logging } from "../../logs/index.js";
import { rateLimit, Options, RateLimitRequestHandler } from 'express-rate-limit'
import { HttpException } from "./ExceptionHandler.js";

const LIMITER_HANDLER = () => HttpException.ThrottleException()
export class Limiter {
    private static instance: Limiter
    private static AllLimiters: string[]=[];

    constructor(private app: Application) {
      
    }
    /**
     * Create a new instance of the Limiter class.
     *
     * @param {Application} app - The application object.
     * @return {Limiter} - The new instance of the Limiter class.
     */
    static createInstance(app: Application): Limiter {
        if (!(this instanceof Limiter)) {
            Limiter.instance = new Limiter(app);
        }
        return Limiter.instance
    }
    /**
     * Enabled the use of RateLimiter in Api Calls
     *
     * @param {number | "noLimit"} limit - The limit parameter that specifies the maximum number of something or "noLimit" to indicate no limit.
     * @param {number} timeout - The timeout parameter that specifies the duration in milliseconds.
     */
    static useLimiter(limit: number | "noLimit", timeout: number = 0) {
        if (limit === "noLimit") return;
        if (timeout === 0) timeout = 1;
        Logging.alert("Rate Limiting is Enabled")
        Limiter.AllLimiters.push("Default Limiter")
        const limiter = rateLimit({
            windowMs: timeout * 60 * 1000, // 15 minutes
            max: limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
            legacyHeaders: false, // X-RateLimit-* headers
            handler: LIMITER_HANDLER
            // store: ... , // Use an external store for more precise rate limiting
        })
        Limiter.instance.app.use(limiter)
    }
    static new(LimiterName: string, LimiterOptions: Omit<Partial<Options>, "handler">): RateLimitRequestHandler {
        Limiter.AllLimiters.push(LimiterName)
        Logging.alert("Rate Limiting is Enabled, Name " + LimiterName)

        return rateLimit({ ...LimiterOptions, handler: LIMITER_HANDLER })
    }
    static getActiveLimiters(): string[] {
        return this.AllLimiters
    }
}