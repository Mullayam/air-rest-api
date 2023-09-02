import { Application } from "express";

export class Limiter {
    private static instance: Limiter
    constructor(private app: Application) {

    }
    /**
     * Create a new instance of the Limiter class.
     *
     * @param {Application} app - The application object.
     * @return {Limiter} - The new instance of the Limiter class.
     */
    static createInstance(app: Application):Limiter {
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
    static useLimiter(limit: number | "noLimit", timeout: number=1000) {

    }
}