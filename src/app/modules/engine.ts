import { Adapters } from "./adapters.js";
import { CacheService } from "app/cache/CacheService.js";
import { Logging } from "app/logs";

export class Engine {
    constructor(){
        Logging.log("Initializing App Engine Cache/Adapters Services ");
        new CacheService()
        Adapters.prototype.InitiaitePaytmInstance();
    }
}