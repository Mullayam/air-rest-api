import express, { Application, NextFunction } from 'express'
import { AppServer } from './app/bootstrap.js'
import { Logging } from "./logs/index.js";
import { Engine } from './app/modules/engine.js'
import bodyParser from 'body-parser';
import { Cors } from './app/lib/Cors.js';
import { useContainer, useExpressServer } from '@enjoys/modules'
import { Controllers } from './controllers/index.js';
import { Container } from './app/modules/common/index.js';
import { HttpException } from './app/lib/ExceptionHandler.js';
import { Middlewares } from './middlewares/index.js';
export class Kernel {
    protected static app: Application;
    constructor() {
        const app = express();
         
        Kernel.app = useExpressServer(app, {
            controllers: [...Controllers],
            cors: { ...Cors.options() },
            middlewares: [...Middlewares],
            defaultErrorHandler: false,
            defaults: {
                nullResultCode: 404,
                undefinedResultCode: 204,
            },
        })
      
        this.config()
        this.LoadInstances()
        this.LoadAppModules()

    }
    private config(): void {
        Logging.log("Applying Configurations")
        useContainer(Container)
        Kernel.app.use(express.json());
        Kernel.app.use(bodyParser.urlencoded({ extended: false }));
    }
    /**
     * Loads the application modules.    
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