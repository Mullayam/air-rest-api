import url from 'url'
import path from 'path';
import cors from 'cors';
import { blue } from "colorette"
import bodyParser from "body-parser";
import express, { Application } from 'express'
import { Logging } from './logs';
import { AppRoutes } from 'routes/web';

export class AppServer {
    protected static app: Application;
    private static PORT: number = 7134
    private static router: express.Router
    constructor(PORT: number) {
        AppServer.app = express()
        AppServer.PORT = PORT
       
        Logging.log("Compiling")
        this.config()
        this.InitializeMiddlewares()
        this.InitializeRoutes()


    }
    private config(): void {
        Logging.log("Applying Configurations")
        AppServer.app.use(express.json());
        AppServer.app.use(cors({ origin: "*", credentials: true }));
        AppServer.app.use(bodyParser.urlencoded({ extended: false }));
    }
    private InitializeMiddlewares() {
        Logging.log("Initializing Middlewares")

    }
    private InitializeRoutes(): void {
        Logging.log("Mapping Routes")
        AppServer.app.use("/",new AppRoutes().router);
    }
    protected static RunApplication(): void {
        AppServer.app.listen(AppServer.PORT, () => {
            console.log(blue(`App listening on port ${AppServer.PORT}`),)
        })
    }

}