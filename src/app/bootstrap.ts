import { blue, red } from "colorette"
import { Application } from 'express'
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
        this.InitializeMiddlewares()
        this.InitializeRoutes()
        this.Exceptions()
    }    
    /**
     * Initializes the middlewares for the application.
      
     */
    private InitializeMiddlewares() {
        Logging.log("Initializing Middlewares")       
        
    }
    /**
     * Initializes the Exceptions handler for the AppServer.
     *
     * @param {Error} err - The error object.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     * @return {void} This function does not return anything.
     */
    private Exceptions(): void {        
        AppServer.app.use(async (err: Error, req: any, res: any, next: any) => {
            if (err) HttpException.ExceptionHandler(err, res, res, next)
            return next()
        });
    }
    /**
     * Initializes the routes for the application.
     *
     * This function maps the routes for the application and sets up the routing middleware.
     * It logs a message indicating that the routes are being mapped and uses the `AppRoutes`
     * class to define the routes. The routes are then registered with the `AppServer` instance.
     */
    private InitializeRoutes(): void {
        Logging.log("Mapping Routes")
        AppServer.app.use(this.express.static(`${process.cwd()}/pages`));
        AppServer.app.use("/", new AppRoutes().router);
    }
    /**
     * Runs the application server
     
     */
    static RunApplication(): void {
        try {
            AppServer.app.listen(AppServer.PORT, () => {
                console.log(blue(`App listening on port http://localhost:${AppServer.PORT}`),)
            })
        } catch (error: any) {
            console.log(red(error))
        }
    }

}