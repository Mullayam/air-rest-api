import express, { Application } from 'express'
import { AppServer } from './app/bootstrap.js'
import { Logging } from "./logs/index.js";
import { Engine } from './app/modules/engine.js'

export class Kernel {
    protected static app: Application;
    constructor() {
        Kernel.app = express();
        this.LoadInstances()
        this.LoadAppModules()
        
    }
    /**
     * Loads the application modules.
     *
     * @private
     */
    private LoadAppModules() {
        Logging.log("Loading App Modules")
        new AppServer(Kernel.app, express)
    }
    /**
     * LoadInstances is a private function that prepares an instance to launch.
     * 
     * @private     
     */
    private LoadInstances():void {
        Logging.log("Preparing Instance To Launch")
        new Engine(Kernel.app)
    }
    
    /**
     * Initializes the application.
     *     
     */
    InitailizeApplication() {
        Logging.info("InitailizeApplication")
        AppServer.RunApplication()
    }

}