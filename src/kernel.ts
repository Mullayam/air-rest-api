import express, { Application } from 'express'
import { AppServer } from './app/bootstrap.js'
import { Logging } from "./logs/index.js";
import { Engine } from './app/modules/engine.js'
import bodyParser from 'body-parser';
import { Cors } from './app/lib/Cors.js';

export class Kernel {
    protected static app: Application;
    /**
     * Initializes the constructor.    
     */
    constructor() {

        Kernel.app = express();
        this.config()
        this.LoadInstances()
        this.LoadAppModules()

    }
    /**
    * Applies the necessary configurations to the application.
    */
    private config(): void {
        Logging.log("Applying Configurations")
        Kernel.app.use(express.json());
        Kernel.app.use(Cors.useCors);
        Kernel.app.use(bodyParser.urlencoded({ extended: false }));
    }
    /**
     * Loads the all necessary application modules.    
     * @private
     */
    private LoadAppModules() {
        Logging.log("Loading App Modules")
        new AppServer(Kernel.app, express)
    }
    /**
     * LoadInstances is a private function that prepares an instance to launch.  * 
     * @private  
     */
    private LoadInstances(): void {
        Logging.log("Preparing Instance To Launch")
        new Engine(Kernel.app)

    }
    /**
     * Initializes the application. 
     */
    InitailizeApplication() {
        Logging.info("InitailizeApplication")
        AppServer.RunApplication()
    }
}