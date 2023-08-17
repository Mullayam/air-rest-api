import { Kernel } from "./kernel.js";
import { CacheService } from "app/cache/CacheService.js";
import { Logging } from "app/logs";
;



export class Engine {

    constructor(){
        Logging.log("Initializing App Engine Cache/Kernel Services ");
        new CacheService()
        Kernel.prototype.InitiaitePaytmInstance();
    }
}