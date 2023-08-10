import path from 'path';
import winston from 'winston'
import { yellow } from "colorette"
import { LoggingLevel, LoggingOptions } from 'types';
import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf, colorize } = format;
const LogsPath = path.join(__dirname)

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
  private HandleCreateLogger(level: LoggingLevel = "debug") {
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
  static info(message: string) {
    return this.prototype.HandleCreateLogger("info").info(message)
  }
  static error(message: string) {
    return this.prototype.HandleCreateLogger("error").error(message)
  }
  static log(text: string) {
    console.log(yellow(`----------- ${text} -------------`))

  };


}