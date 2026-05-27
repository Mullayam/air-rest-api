import type { Application } from "express";
import { Logging } from "@/logs";
import { AppEvents } from "@/utils/services/Events";
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
		this.mount();
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
		this.app.get("/health", (_req, res) => {
			res.status(200).json({ status: "ok", message: "Server is running" });
		});
		this.modifiedCustomFunction();
	}
	/**
	 * Mounts the application.
	 */
	private mount() {
		this.app.on("mount", (_parent) => console.log("Application Mounted"));
		for (const event of this._events) {
			this.app.on(event, () => console.log(event));
		}
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
