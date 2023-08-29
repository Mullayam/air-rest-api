import cors from 'cors';
import { blue, red } from "colorette"
import bodyParser from "body-parser";
import { Application, NextFunction } from 'express'
import { Logging } from '../logs/index.js';
import { AppRoutes } from '../routes/web.js';
import { HttpException } from './lib/ExceptionHandler.js';


export class AppServer {
    protected static app: Application;
    private static PORT: number = 713;
    constructor(app: Application, private readonly express: any, PORT: number = 7134) {
        AppServer.app = app
        AppServer.PORT = PORT
        Logging.log("Compiling")
        this.config()
        this.InitializeMiddlewares()
        this.InitializeRoutes()
        this.Exceptions()
    }
    private config(): void {
        Logging.log("Applying Configurations")
        AppServer.app.use(this.express.json());
        AppServer.app.use(cors({ origin: "*", credentials: true }));
        AppServer.app.use(bodyParser.urlencoded({ extended: false }));
    }
    private InitializeMiddlewares() {
        Logging.log("Initializing Middlewares")
    }
    private Exceptions(): void {
        AppServer.app.use(async (err: Error, req: any, res: any, next: any) => {
            if (err) HttpException.ExceptionHandler(err, res, res, next)
            return next()
        });
    }
    private InitializeRoutes(): void {
        Logging.log("Mapping Routes")
        AppServer.app.use("/", new AppRoutes().router);
    }
    static RunApplication(): void {
        try {
            AppServer.app.listen(AppServer.PORT, () => {
                console.log(blue(`App listening on port ${AppServer.PORT}`),)
            })
        } catch (error: any) {
            console.log(red(error))
        }
    }

}