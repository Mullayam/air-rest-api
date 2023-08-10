import url from 'url'
import path from 'path';
import cors from 'cors';
import { blue } from "colorette"
import bodyParser from "body-parser";
import express, { Application, NextFunction } from 'express'
import { Logging } from './logs';
import { AppRoutes } from 'routes/web';
import { HttpException } from './lib/ExceptionHandler';


export class AppServer {
    protected static app: Application;
    private static PORT: number = 7134
    constructor(PORT: number) {
        AppServer.app = express()
        AppServer.PORT = PORT
        Logging.log("Compiling")
        this.config()
        this.InitializeMiddlewares()
        this.InitializeRoutes()
        this.Exceptions()
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
    private Exceptions(): void {
        AppServer.app.use(async(err: Error, req: any, res: any, next: any) => { 
            if (err) HttpException.ExceptionHandler(err, res, res, next)
            return next()
        });
    }
    private InitializeRoutes(): void {
        Logging.log("Mapping Routes")
        AppServer.app.use("/", new AppRoutes().router);
    }
    protected static RunApplication(): void {
        AppServer.app.listen(AppServer.PORT, () => {
            console.log(blue(`App listening on port ${AppServer.PORT}`),)
        })
    }

}