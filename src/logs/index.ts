import path from "node:path";
import type {
	LoggingLevel,
	LoggingOptions,
} from "@/utils/interfaces/logs.interface";
import { bold, greenBright, magenta, red, white, yellow } from "colorette";
import moment from "moment";
import winston from "winston";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, colorize } = format;
const LogsPath = path.join(process.cwd(), "src", "logs");

const Colors: Record<LoggingLevel, string> = {
	info: "blue",
	error: "red",
	alert: "yellow",
	debug: "magenta",
	crit: "red",
	emerg: "white",
	notice: "cyan",
};

class Logger {
	constructor() {
		process.stdout.write("\u001b[2J\u001b[0;0H");
		process.stdout.write(
			greenBright(
				`[ENJOYS] ${yellow(process.pid)} - ${white(moment().format("DD/MM/YYYY hh:mm:ss A"))}, INFO ${Logger.name} Service Iniatialized \n`,
			),
		);
	}
	/**
	 * Generates the LoggingOptions object.
	 *
	 * @return {LoggingOptions} The LoggingOptions object with the specified configuration.
	 */
	private LoggingOptions(): LoggingOptions {
		return {
			file: {
				level: "info",
				filename: `${LogsPath}/apps.log`,
				handleExceptions: false,
				json: false,
				maxsize: 5242880, // 5MB
				maxFiles: 5,
				colorize: false,
				// format: winston.format.json(),
			},
			console: {
				level: "debug",
				handleExceptions: true,
				json: false,
				colorize: true,
				format: winston.format.simple(),
			},
		};
	}
	/**
	 * Creates a logger with the specified logging level.
	 *
	 * @param {LoggingLevel} [level="info"] - The logging level to use. Defaults to "info".
	 * @return {Logger} - The created logger.
	 */
	private HandleCreateLogger(level: LoggingLevel = "info") {
		return createLogger({
			format: combine(
				// colorize({ all: true, level: true, message: true, colors: Colors }),
				timestamp({ format: "YYYY-MM-DD HH:mm:ss a" }),
				printf(
					(info) =>
						`[ENJOYS-API] ${info.level.toUpperCase()}, ${info.timestamp} - ${info.message}`,
				),
			),
			levels: winston.config.syslog.levels,
			transports: [
				new transports.File({
					filename: `${LogsPath}/error.log`,
					level: level,
				}),
				new transports.File(this.LoggingOptions().file),
				new transports.Console(this.LoggingOptions().console),
			],
			rejectionHandlers: [
				new transports.File({ filename: `${LogsPath}/rejection.log` }),
			],
			exceptionHandlers: [
				new transports.File({ filename: `${LogsPath}/error.log` }),
			],
			exitOnError: false,
		});
	}
	/**
   * Logs an info message.
   *
   * @param {string} message - The message to log.
    
   */
	info(message: string) {
		return this.HandleCreateLogger("info").info(message);
	}
	/**
   * A static method that handles an error message.
   *
   * @param {string} message - The error message to handle.
    
   */
	error(message: string) {
		return this.HandleCreateLogger("error").error(message);
	}
	/**
	 * Logs a message to the console.
	 *
	 * @param {string} text - The message to be logged.
	 */
	log(text: string) {
		process.stdout.write(yellow(`----------- ${text} -------------`));
	}
	dev(text: string, type: LoggingLevel = "info") {
		if (type === "info") {
			return process.stdout.write(
				greenBright(
					`[ENJOYS] ${yellow(process.pid)} - ${white(moment().format("DD/MM/YYYY hh:mm:ss A"))}, ${(type).toUpperCase()} ${text} \n`,
				),
			);
		}
		if (type === "error") {
			return process.stdout.write(
				red(
					`[ENJOYS] ${process.pid} - ${white(moment().format("DD/MM/YYYY hh:mm:ss A"))}, ${(type).toUpperCase()} ${text} \n`,
				),
			);
		}
		if (type === "debug") {
			process.stdout.write(
				bold(
					`[ENJOYS] ${process.pid} - ${white(moment().format("DD/MM/YYYY hh:mm:ss A"))},${(type).toUpperCase()} ${text} \n`,
				),
			);
			return process.exit(1);
		}
		if (type === "alert") {
			process.stdout.write(
				magenta(
					`[ENJOYS] ${yellow(process.pid)} - ${white(moment().format("DD/MM/YYYY hh:mm:ss A"))}, ${(type).toUpperCase()} ${text}\n`,
				),
			);
		}
		if (type === "notice") {
			return process.stdout.write(
				yellow(
					`[ENJOYS] ${process.pid} - ${white(moment().format("DD/MM/YYYY hh:mm:ss A"))}, ${(type).toUpperCase()} ${text}\n`,
				),
			);
		}
	}
	/**
	 * Prints the given text in the console with a formatted alert message.
	 *
	 * @param {string} text - The text to be displayed in the alert message.
	 */
	alert(text: string) {
		process.stdout.write(magenta(`----------- ${text} -------------`));
	}
}
const Logging = new Logger();
export { Logging };
