import { Application } from "express";
import { Logging } from "../../logs/index.js";
import { rateLimit, Options, RateLimitRequestHandler } from 'express-rate-limit'
export class Limiter {
    private static instance: Limiter
    private static AllLimiters: string[];

    constructor(private app: Application) {
        Logging.alert("Rate Limiting is Enabled")
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
        if (timeout === 0) return;
        const limiter = rateLimit({
            windowMs: timeout * 60 * 1000, // 15 minutes
            max: limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
            legacyHeaders: false, // X-RateLimit-* headers
            // store: ... , // Use an external store for more precise rate limiting
        })
        Limiter.instance.app.use(limiter)
    }
    static new(LimiterName: string, LimiterOptions: Partial<Options>): RateLimitRequestHandler {
        this.AllLimiters.push(LimiterName)
        return rateLimit(LimiterOptions)
    }
    static getActiveLimiters(): string[] {
        return this.AllLimiters
    }
}