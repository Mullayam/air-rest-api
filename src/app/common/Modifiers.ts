import { Logging } from "@/logs";
import { AppEvents } from "@/utils/services/Events";
import type { Application, NextFunction, Request, Response } from "express";
import { AppLifecycleManager } from "../modules/appLifecycle";

export class Modifiers {
	private _instance!: Modifiers;
	private readonly title = "Air API - ENJOYS";
	private readonly _events = [
		"route-matched",
		"mount",
		"connect",
		"connection",
		"close",
		"error",
		"listening",
		"lookup",
		"ready",
		"timeout",
	];
	constructor(private readonly app: Application) {
		Logging.dev("Modifiers Initiated");
		this.set();
		this.mount;
	}
	/**
	 * Set the value of this.app.locals.title to "Air API - ENJOYS"
	 *
	 */
	private set() {
		this.app.locals.title = this.title;
		this.app.disable("x-powered-by");
		this.app.set("trust proxy", 1);
		this.app.set("title", this.title);
		this.app.use(this.customHeaders);
		this.app.get("/health", (req, res) => {
			res.status(200).json({ status: "Ok Report Hai Ji", message: "Server is running" });
		});
		this.modifiedCustomFunction();
	}

	private customHeaders(req: Request, res: Response, next: NextFunction) {
		res.setHeader("X-Powered-By", "AIRAPI-ENJOYS");
		next();
	}
	/**
	 * Mounts the application.
	 */
	private mount() {
		this.app.on("mount", (parent) => console.log("Application Mounted"));
		this._events.forEach((event) =>
			this.app.on(event, () => console.log(event)),
		);
	}
	private modifiedCustomFunction() {
		this.app.enableHooks = () => AppLifecycleManager.setAppLifecycleManager();
		this.app.event = (event: string, callback: () => void) =>
			AppEvents.emit(event, callback);
	}
	static useRoot(app: Application) {
		if (!Modifiers.prototype._instance) {
			Modifiers.prototype._instance = new Modifiers(app);
			return;
		}
		return Modifiers.prototype._instance;
	}
}
