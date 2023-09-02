import { Adapters } from "./adapters.js";
import { CacheService } from "../cache/CacheService.js";
import { Logging } from "../../logs/index.js";
import { XResponse } from '../lib/Response.js'
import { Application } from "express";
import { Interceptor } from "../lib/Interceptors.js";
import { Platform } from "../../services/Platform.js";
import { Middlewares } from "../../middlewares/app.middlewares.js";
export class Engine {
    constructor(private app: Application) {
        Logging.log("Initializing App Engine Cache/Adapters Services ");
        // Initialize Interceptor to modify Response body
        this.InitInterceptor()
        // Enable/Disable Cache Service
        new CacheService(process.env.CACHE_ENBALED as string)
        // Enabled Paytm Transaction Router Service
        Adapters.prototype.InitiaitePaytmInstance();
        // Set Response instance
        this.app.use((req, res, next) => { new XResponse(res); next() });
        this.app.use(Middlewares.AppMiddlewareFunction);
        Platform.LaunchWindow()
    }
    /**
     * Initializes the interceptor.
     *
     * @private
     * @return {void}
     */
    private InitInterceptor():void{
        Interceptor.useInterceptors(this.app, { response: { test: "Interceptor Response " }, isEnable: false })
    }


}