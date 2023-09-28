import { Adapters } from "./adapters.js";
import { CacheService } from "../cache/CacheService.js";
import { Logging } from "../../logs/index.js"; 
import { Application } from "express";
import { Interceptor } from "../lib/Interceptors.js";
import { Platform } from "../lib/Platform.js";
import { Limiter } from "../lib/Limiter.js";
import { MailService } from "../lib/MailService.js";
export class Engine {
    constructor(private app: Application) {
        Logging.log("Initializing App Engine Cache/Adapters Services ");
        // Create Rate Limiter Instance to use throughout Application
        Limiter.createInstance(this.app)
        // Create Mail Service Instance to use throughout Application
        MailService.createInstance()
        // Initialize Interceptor to modify Response body
        this.InitInterceptor()
        // Enable/Disable Cache Service
        new CacheService(process.env.CACHE_ENBALED as string)
        // Enabled Paytm Transaction Router Service
        Adapters.prototype.InitiaitePaytmInstance();
        // Set Response instance       
      
        Platform.LaunchWindow()
    }
    /**
     * Initializes the interceptor.
     *
     * @private
     * @return {void}
     */
    private InitInterceptor(): void {
        Interceptor.useInterceptors(this.app, { response: { test: "Interceptor Response " }, isEnable: false })
    }
    /**
     * This function is called when the throttle is enabled. It uses the Limiter class
     * to set the limiter to "noLimit" with a delay of 1000 milliseconds.
     
     */
    private ThrottleRequest(): void {
        // pass option to use limiter default activate throughout global app
        Limiter.useLimiter(5)
    }
    /**
     * Initializes the module.    
     * Include/Create All Adapters/Methods here to excecute and prepare before application started
     */
    static InitModuleCustomSettings() {
        this.prototype.ThrottleRequest()
    }

}