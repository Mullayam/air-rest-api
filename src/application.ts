import * as http from 'http'
import express, { Application } from 'express'
import morgan from 'morgan'
import helmet from 'helmet';
import { Logging } from '@/logs';
import bodyParser from 'body-parser';
import { blue } from 'colorette';
import { __CONFIG__ } from './app/config';
import { Cors } from '@/app/common/Cors';
import cookieParser from 'cookie-parser'
import AppRoutes from '@/routes/web';
import { useHttpsRedirection } from '@/app/common/HttpsRedirection'
import { createHandlers } from '@enjoys/exception';
import { SessionHandler } from '@/app/common/Session';
import { Interceptor } from '@/app/common/Interceptors'
import { RouteResolver } from '@/app/common/RouteResolver';
import { AppMiddlewares } from '@/middlewares/app.middleware';
import { getSocketIo } from '@/utils/services/sockets/Sockets';
import BroadCastEvents from '@/utils/services/sockets/broadCastEvents';
import { CreateConnection } from '@factory/typeorm'
import { AppLifecycleManager } from '@app/modules/appLifecycle';
import { AppEvents } from './utils/services/Events';
import { Modifiers } from './app/common/Modifiers';
const io = getSocketIo()


class AppServer {
    static App: Application = express();
    static PORT: number = +__CONFIG__.APP.APP_PORT;
    /**
     * Initializes the constructor.
     */
    constructor() {
        AppLifecycleManager.initializeModules()
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
    private ApplyConfiguration(): void {
        Logging.dev("Applying Express Server Configurations")
        Modifiers.useRoot(AppServer.App)
        AppServer.App.use(helmet());
        AppServer.App.use(morgan("dev"));       
        AppServer.App.use(Cors.useCors());
        AppServer.App.use(bodyParser.json());
        AppServer.App.use(useHttpsRedirection);
        AppServer.App.use(AppMiddlewares.attachIoToRequestHandler(io));
        AppServer.App.use(SessionHandler.forRoot());
        AppServer.App.use(cookieParser(__CONFIG__.SECRETS.COOKIE_SECRET));
        AppServer.App.use(bodyParser.urlencoded({ extended: false }));
    }
    /**
     * Initializes the middlewares for the application.
     *
     * This function checks the environment variable `APP_ENV` and if it is set
     * to `'production'`, it adds the necessary middlewares for request headers
     * and API protection to the application server.
     */
    private InitMiddlewares(): void {
        Logging.dev("Middlewares Initiated")
        /** Enable Request headers for production */
        if (__CONFIG__.APP.APP_ENV.toUpperCase() === 'PRODUCTION' || __CONFIG__.APP.APP_ENV.toUpperCase() === 'PROD') {
            AppServer.App.use(AppMiddlewares.IRequestHeaders())
            AppServer.App.use(AppMiddlewares.isApiProtected())
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
    private LoadInterceptors(): void {
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
    private RegisterRoutes(): void {
        Logging.dev("Registering Routes")
        AppServer.App.use(AppRoutes);
        RouteResolver.Mapper(AppServer.App, { listEndpoints: true, });
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

    private ExceptionHandler(): void {
        Logging.dev("Exception Handler Initiated")
        const { ExceptionHandler } = createHandlers();
        AppServer.App.use(ExceptionHandler);

    }
    private InitServer() {
        const server = http.createServer(AppServer.App).listen(AppServer.PORT, () => {
            io.attach(server)
            AppEvents.emit('ready')
            console.log(blue(`Application Started Successfully on ${__CONFIG__.APP.APP_URL}`),)

        })
        server.on('close', () => {
            AppEvents.emit('shutdown')
            this.CloseServer(server)
        })
        server.on('listening', () => {
            console.log('The server is now ready and listening for connections.');
            AppEvents.emit('start')

        });
        server.on('error', (err: any) => {
            AppEvents.emit('error')
            if (err.code === 'EADDRINUSE') {
                Logging.dev(`Address in use, retrying on port ${AppServer.PORT}`, "error");
            } else {
                console.log(`server.listen ERROR: ${err.code}`);
            }
        })
    }
    /**
        * Initializes the application. 
    */
    InitailizeApplication(): Application {
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
            return AppServer.App
        }
    }
    /**
     * Gracefully shuts down the application.
     *
     * @private
     */
    private GracefulShutdown(): void {
        process.on('SIGINT', () => {
            AppLifecycleManager.destroyModules();
            BroadCastEvents.sendServerClosed()
            AppEvents.emit('shutdown')
            Logging.dev("Manually Shutting Down", "notice")
            process.exit(1);
        })
        process.on('SIGTERM', () => {
            AppLifecycleManager.destroyModules();
            BroadCastEvents.sendServerClosed()
            AppEvents.emit('shutdown')
            Logging.dev("Error Occured", "error")
            process.exit(1);
        })
        process.on('uncaughtException', (err, origin) => {
            AppLifecycleManager.handleAppError(err)
            Logging.dev(`Uncaught Exception ${err.name} ` + err.message + err.stack, "error")
            Logging.dev(`Origin Of Error ${origin} `, "error")

        });
        process.on('unhandledRejection', (reason, promise) => {
            AppLifecycleManager.handleAppError(reason as Error)
            Logging.dev(`Unhandled Rejection at ${promise}, reason: ${reason}`, "error")
        });
    }
    /**
     * Closes the given server and exits the process.
     *
     * @param {http.Server} server - The server to be closed.
     */
    private CloseServer(server: http.Server): void {
        server.close(() => process.exit(1));
    }
}
export const bootstrap = { AppServer: new AppServer(), express }
