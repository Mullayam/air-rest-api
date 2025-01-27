import * as http from "node:http";
import { join } from "node:path";
import cors from "cors";

import { Cors } from "@/app/common/Cors";
import { useHttpsRedirection } from "@/app/common/HttpsRedirection";
import { Interceptor } from "@/app/common/Interceptors";
import { RouteResolver } from "@/app/common/RouteResolver";
import { SessionHandler } from "@/app/common/Session";
import { Logging } from "@/logs";
import { AppMiddlewares } from "@/middlewares/app.middleware";
import AppRoutes from "@/routes/web";
import { getSocketIo } from "@/utils/services/sockets/Sockets";
import BroadCastEvents from "@/utils/services/sockets/broadCastEvents";
import { AppLifecycleManager } from "@app/modules/appLifecycle";
import { createHandlers } from "@enjoys/exception";
import { CreateConnection,CloseConnection } from "@factory/typeorm";
import bodyParser from "body-parser";
import { blue } from "colorette";
import cookieParser from "cookie-parser";
import express, { type Application } from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import morgan from "morgan";
import { Modifiers } from "./app/common/Modifiers";
import { __CONFIG__ } from "./app/config";
import { AppEvents } from "./utils/services/Events";
import { Cache } from "./utils/services/redis/cacheService";

const io = getSocketIo();

class AppServer {
	static App: Application = express();
	static PORT = +__CONFIG__.APP.APP_PORT;
	/**
	 * Initializes the constructor.
	 */
	constructor() {
		AppLifecycleManager.initializeModules();
		this.ApplyConfiguration();
		this.InitMiddlewares();
		this.LoadInterceptors();
		this.RegisterRoutes();
		this.ExceptionHandler();
		this.GracefulShutdown();
	}
	/**
	 * Applies the necessary configurations to the AppServer.
	 *
	 * No parameters.
	 *
	 * @return {void} This function does not return anything.
	 */
	private ApplyConfiguration(): void {
		Logging.dev("Applying Express Server Configurations");
		this.MakeAssetsPublic();
		Modifiers.useRoot(AppServer.App);
		AppServer.App.use(helmet({ crossOriginResourcePolicy: false }));
		AppServer.App.use(morgan("dev"));
		AppServer.App.use(cors(Cors.options()));
		AppServer.App.use(bodyParser.json());
		AppServer.App.use(useHttpsRedirection);
		AppServer.App.use(SessionHandler.forRoot());
		AppServer.App.use(fileUpload({ tempFileDir: "./" }));
		AppServer.App.use(bodyParser.urlencoded({ extended: false }));
		AppServer.App.use(AppMiddlewares.attachIoToRequestHandler(io));
		AppServer.App.use(cookieParser(__CONFIG__.SECRETS.COOKIE_SECRET));
	}
	/**
	 * Configures the Express application to serve static assets.
	 *
	 * Sets up a route to serve static files from the 'uploads' directory under the '/public' path.
	 * The function configures various options for serving static files, such as ignoring dotfiles,
	 * disabling etag, setting file extensions, and setting cache max age to 1 day. Additionally,
	 * a custom header with a timestamp is added to each response.
	 */
	private MakeAssetsPublic() {
		const options = {
			dotfiles: "ignore",
			etag: false,
			extensions: ["htm", "html"],
			index: false,
			maxAge: "1d",
			redirect: false,
			setHeaders(res: any, path: any, stat: any) {
				res.set("x-timestamp", Date.now());
			},
		};
		AppServer.App.use(
			"/public",
			express.static(join(process.cwd(), "uploads"), options),
		);
	}
	/**
	 * Initializes the middlewares for the application.
	 *
	 * This function checks the environment variable `APP_ENV` and if it is set
	 * to `'production'`, it adds the necessary middlewares for request headers
	 * and API protection to the application server.
	 */
	private InitMiddlewares(): void {
		Logging.dev("Middlewares Initiated");
		/** Enable Request headers for production */
		if (
			__CONFIG__.APP.APP_ENV.toUpperCase() === "PRODUCTION" ||
			__CONFIG__.APP.APP_ENV.toUpperCase() === "PROD"
		) {
			AppServer.App.use(AppMiddlewares.IRequestHeaders());
			AppServer.App.use(AppMiddlewares.isApiProtected());
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
		Logging.dev("Registering Routes");
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

	private ExceptionHandler(): void {
		Logging.dev("Exception Handler Initiated");
		const { ExceptionHandler } = createHandlers();
		AppServer.App.use(ExceptionHandler);
	}
	private InitServer() {
		const server = http
			.createServer(AppServer.App)
			.listen(AppServer.PORT, () => {
				io.attach(server);
				AppEvents.emit("ready");
				console.log(
					blue(`Application Started Successfully on ${__CONFIG__.APP.APP_URL}`),
				);
			});
		server.on("close", () => {
			AppEvents.emit("shutdown");
			this.CloseServer(server);
		});
		server.on("listening", () => {
			console.log("The server is now ready and listening for connections.");
			AppEvents.emit("start");
		});
		server.on("error", (err: any) => {
			AppEvents.emit("error");
			if (err.code === "EADDRINUSE") {
				Logging.dev(
					`Address in use, retrying on port ${AppServer.PORT}`,
					"error",
				);
			} else {
				console.log(`server.listen ERROR: ${err.code}`);
			}
		});
	}
	/**
	 * Initializes the application.
	 */
	InitailizeApplication(): Application {
		Logging.dev("Application Dependencies Injected");
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
			this.InitServer();
			return AppServer.App;
		} catch (error: any) {
			Logging.dev(error.message, "error");
			return AppServer.App;
		}
	}
	/**
	 * Gracefully shuts down the application.
	 *
	 * @private
	 */
	private GracefulShutdown(): void {
		process.on('SIGINT', () => {
            this.closeAllOpenedConnection()
            Logging.dev("Manually Shutting Down", "notice")
            process.exit(1);
        })
        process.on('SIGTERM', () => {
            this.closeAllOpenedConnection()
            Logging.dev("Error Occured", "error")
            process.exit(1);
        })
		process.on("uncaughtException", (err, origin) => {
			AppLifecycleManager.handleAppError(err);
			Logging.dev(
				`Uncaught Exception ${err.name} ${err.message}${err.stack}`,
				"error",
			);
			Logging.dev(`Origin Of Error ${origin} `, "error");
		});
		process.on("unhandledRejection", (reason, promise) => {
			AppLifecycleManager.handleAppError(reason as Error);
			Logging.dev(
				`Unhandled Rejection at ${promise}, reason: ${reason}`,
				"error",
			);
		});
	}
	private closeAllOpenedConnection() {
        AppLifecycleManager.destroyModules()
        BroadCastEvents.sendServerClosed();
        AppEvents.emit('shutdown')
		/** NOTE  Close Database/Redis or any opened Connection */
        // CloseConnection()
        // Cache.closeClonnection()
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
export const bootstrap = { AppServer: new AppServer(), express };
