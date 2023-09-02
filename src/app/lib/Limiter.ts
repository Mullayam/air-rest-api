import { Application } from "express";

export class Limiter {
    private static instance: Limiter
    constructor(private app: Application) {

    }
    static createInstance(app: Application) {
        if (!(this instanceof Limiter)) {
            Limiter.instance = new Limiter(app);
            
        }
        return this
    }
    static useLimiter() {

    }
}