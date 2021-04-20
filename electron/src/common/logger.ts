import { kDNSServiceFlagsIndeterminate } from "mdns";

export enum LogLevel {
    Error,
    Warning,
    Info,
    Debug,
    Verbose
}

interface ILogger {
    logMessage: (level: string, message: string) => void;
}

abstract class Logger {
    private static loggers: Map<number, ILogger[]> = new Map<LogLevel, ILogger[]>();

    private static initialize = (() => {
        for (var level in LogLevel) {
            const levelNumber = Number(level);
            if (!isNaN(levelNumber)) {
                Logger.loggers.set(levelNumber, []);
            }
        }
    })();

    static registerLogger = (logLevel: LogLevel, logger: ILogger) => {
        const tempLoggers = Logger.loggers.get(logLevel);
        tempLoggers.push(logger);
        Logger.loggers.set(logLevel, tempLoggers)
    }

    static verbose = (message: string) => Logger.log(LogLevel.Verbose, message);
    static debug = (message: string) => Logger.log(LogLevel.Debug, message);
    static info = (message: string) => Logger.log(LogLevel.Info, message);
    static warning = (message: string) => Logger.log(LogLevel.Warning, message);
    static error = (message: string) => Logger.log(LogLevel.Error, message);

    static log = (logLevel: LogLevel, message: string): void => {
        for (var level in LogLevel) {
            const levelNumber = Number(level);
            if (!isNaN(levelNumber)) {
                if (levelNumber <= logLevel) {
                    const logLevelString = LogLevel[levelNumber];
                    Logger.loggers.get(levelNumber).forEach(logger => {
                        logger.logMessage(logLevelString, message);
                    });
                }
            }
        }
    }
}

export class ConsoleLogger implements ILogger {
    logMessage = (level: string, message: string) => {
        console.log(`[${level}] ${message}`);
    }
}

export default Logger;