import path from 'path';
import winston from 'winston'
import { blue, cyan, green, magenta, redBright, yellow } from "colorette"
import { LoggingLevel, LoggingOptions } from '../types/index.js';
import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf, colorize } = format;
const LogsPath = path.join(process.cwd(), 'src', 'logs')

const Colors: Record<LoggingLevel, string> = {
  info: "blue",
  error: "red",
  alert: "yellow",
  debug: "magenta",
  crit: "red",
  emerg: "white",
  notice: "cyan"
}

export class Logging {
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
        handleExceptions: true,
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
    }
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
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf((info) => `[AirAPI] ${info.level.toUpperCase()} ${info.timestamp} - ${info.message}`)
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
  static info(message: string) {
    return this.prototype.HandleCreateLogger("info").info(message)
  }
  /**
   * A static method that handles an error message.
   *
   * @param {string} message - The error message to handle.
    
   */
  static error(message: string) {
    return this.prototype.HandleCreateLogger("error").error(message)
  }
  /**
   * Logs a message to the console.
   *
   * @param {string} text - The message to be logged.
   */
  static log(text: string) {
    console.log(yellow(`----------- ${text} -------------`))
  };
  /**
   * Prints the given text in the console with a formatted alert message.
   *
   * @param {string} text - The text to be displayed in the alert message.
   */
  static alert(text: string) {
    console.log(magenta(`----------- ${text} -------------`))
  };
  static map(text: string) {    
    console.log(yellow(`[AirAPI] [${new Date().toLocaleString()}][INFO] ${text}`))  };

}