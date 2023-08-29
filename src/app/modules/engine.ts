import { Adapters } from "./adapters.js";
import { CacheService } from "../cache/CacheService.js";
import { Logging } from "../../logs/index.js";
import { XResponse } from '../lib/Response.js'
import { Application } from "express";
export class Engine {
    constructor(private app: Application) {
        Logging.log("Initializing App Engine Cache/Adapters Services ");
        // Enable/Disable Cache Service
        new CacheService(process.env.CACHE_ENBALED as string)
        // Enabled Paytm Transaction Router Service
        Adapters.prototype.InitiaitePaytmInstance();
        // Set Response instance
        this.app.use((req, res, next) => { new XResponse(res); next() });
        // Enabled Adapters Routes
        // this.app.use()
      
    }
   
}