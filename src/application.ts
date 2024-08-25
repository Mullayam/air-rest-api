import * as http from 'http'
import express, { Application, NextFunction, Response, Request } from 'express'
import morgan from 'morgan'
import helmet from 'helmet';
import { Logging } from '@/logs';
import bodyParser from 'body-parser';
import { blue, red } from 'colorette';
import { CONFIG } from './app/config';
import { Cors } from '@/app/libs/Cors';
import cookieParser from 'cookie-parser'
import AppRoutes from '@/routes/web';
import { useHttpsRedirection } from '@/app/libs/HttpsRedirection'
import { createHandlers } from '@enjoys/exception';
import { SessionHandler } from '@/app/libs/Session';
import { Interceptor } from '@/app/libs/Interceptors'
import { RouteResolver } from '@/app/libs/RouteResolver';
import { AppMiddlewares } from '@/middlewares/app.middleware';
import { InitScoketConnection } from '@/utils/services/Sockets';
import BroadCastEvents from '@/utils/helpers/broadCastEvents';
import { CreateConnection } from '@factory/typeorm'


class AppServer {
    static App: Application = express();
    static PORT: number = +CONFIG.APP.APP_PORT;
    /**
     * Initializes the constructor.
     */
    constructor() {
        this.ApplyConfiguration();
        this.InitMiddlewares();
        this.LoadInterceptors();
        this.RegisterRoutes();
        this.ExceptionHandler();
        this.GracefulShutdown()
    }
    /**
     * Applies the necessary configurations to the AppServer.
     *
     * No parameters.
     * 
     * @return {void} This function does not return anything.
     */
    private ApplyConfiguration() {
        Logging.dev("Applying Express Server Configurations")
        AppServer.App.use(helmet());
        AppServer.App.disable('x-powered-by');
        AppServer.App.use(morgan("dev"));
        AppServer.App.use(Cors.useCors());
        AppServer.App.use(bodyParser.json());
        AppServer.App.use(useHttpsRedirection);
        AppServer.App.use(SessionHandler.forRoot());
        AppServer.App.use(cookieParser(CONFIG.SECRETS.COOKIE_SECRET));
        AppServer.App.use(bodyParser.urlencoded({ extended: false }));
    }
    /**
     * Initializes the middlewares for the application.
     *
     * This function checks the environment variable `APP_ENV` and if it is set
     * to `'production'`, it adds the necessary middlewares for request headers
     * and API protection to the application server.
     */
    private InitMiddlewares() {
        Logging.dev("Middlewares Initiated")
        /** Enable Request headers for production */
        if (CONFIG.APP.APP_ENV.toUpperCase() === 'PRODUCTION' || CONFIG.APP.APP_ENV.toUpperCase() === 'PROD') {
            AppServer.App.use(AppMiddlewares.IRequestHeaders)
            AppServer.App.use(AppMiddlewares.isApiProtected)
        }
        /** Enable Signature header validation on api routes */
        // AppServer.App.use(AppMiddlewares.SecureApiRoutesWithValidateSignature)

        /** Add your custom middlewares here , if needed on app server initiated */
    }
    /**
     * Load the interceptors for the app server.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    private LoadInterceptors() {
        Interceptor.useInterceptors(AppServer.App, {
            response: { "X-API-PLATFORM STATUS": "OK" }, // enter your custom interceptor in object format
            isEnable: true, // default is false
        });
    }
    /**
     * Registers the routes for the application.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    private RegisterRoutes() {
        Logging.dev("Registering Routes")
        AppServer.App.use(AppRoutes);
        RouteResolver.Mapper(AppServer.App, { listEndpoints: true });

    }
    /**
     * ExceptionHandler function.
     *
     * @param {Error} err - The error that occurred.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function to call.
     * @return {void} There is no return value.
     */

    private ExceptionHandler() {
        Logging.dev("Exception Handler Initiated")
        const { ExceptionHandler } = createHandlers();
        AppServer.App.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err) {
                Logging.dev(err.message, "error")
                return ExceptionHandler(err, req, res, next); // handler error and send response
            }
            next(); // call when no err found
        });

    }
    private InitServer() {
        const server = http.createServer(AppServer.App).listen(AppServer.PORT, () => {
            InitScoketConnection(server)
            console.log(blue(`Application Started Successfully on ${CONFIG.APP.APP_URL}`),)
        })
        server.on('close', () => {
            this.CloseServer(server)
        })

    }
    /**
        * Initializes the application. 
    */
    InitailizeApplication() {
        Logging.dev("Application Dependencies Injected")
        try {
            /** NOTE  Enable Database Connection
             * Using InjectRepository Decorator first Db Connection must be initialized otherwise it will throw error that {repository} is undefined
                *  CreateConnection()
                .then(() => this.InitServer())
                .catch(error => {
                    Logging.dev(error )
                    process.exit(1)
                })   
             */
            this.InitServer()
            return AppServer.App

        } catch (error: any) {
            Logging.dev(error.message, "error")
        }
    }
    /**
     * Gracefully shuts down the application.
     *
     * @private
     */
    private GracefulShutdown() {
        process.on('SIGINT', () => {
            Logging.dev("Manually Shutting Down", "notice")
            BroadCastEvents.sendServerClosed()
            process.exit(1);
        })
        process.on('SIGTERM', () => {
            Logging.dev("Error Occured", "error")
            BroadCastEvents.sendServerClosed()
            process.exit(1);
        })
        process.on('uncaughtException', (err, origin) => {
            Logging.dev(`Uncaught Exception ${err.name} ` + err.message + err.stack, "error")
            Logging.dev(`Origin Of Error ${origin} `, "error")

        });
        process.on('unhandledRejection', (reason, promise) => {
            Logging.dev(`Unhandled Rejection at ${promise}, reason: ${reason}`, "error")
        });
    }
    /**
     * Closes the given server and exits the process.
     *
     * @param {http.Server} server - The server to be closed.
     */
    private CloseServer(server: http.Server) {
        server.close(() => process.exit(1));
    }
}
export const bootstrap = { AppServer: new AppServer(), express }