import { Logger as ConsoleLog } from '@overnightjs/logger';
import { singleton } from 'tsyringe';
import { inspect } from 'util';
import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';
import { ILogger } from './ILogger';

@singleton()
export class LogzioLogger implements ILogger {
    private readonly thirdPartyLoggingApplication: LogzioWinstonTransport;
    private readonly logger: winston.Logger;

    constructor() {
        ConsoleLog.Info('init logger logz.io');
        if (process.env.LOGZIO_TOKEN && process.env.LOGZIO_HOST) {
            this.thirdPartyLoggingApplication = new LogzioWinstonTransport({
                level: 'info',
                name: 'winston_logzio',
                token: process.env.LOGZIO_TOKEN || '',
                host: process.env.LOGZIO_HOST || ''
            });
        }
        this.logger = winston.createLogger({
            format: winston.format.simple(),
            transports:
                !process.env.LOGZIO_TOKEN || !process.env.LOGZIO_HOST
                    ? new winston.transports.Console({
                          level: 'info',
                          format: winston.format.combine(winston.format.colorize(), winston.format.simple())
                      })
                    : [this.thirdPartyLoggingApplication]
        });
    }
    debug(content: any): void {
        this.logger.debug(inspect(content));
    }
    info(content: any): void {
        this.logger.info(inspect(content));
    }
    warn(content: any): void {
        this.logger.warn(inspect(content));
    }
    error(content: any): void {
        this.logger.error(inspect(content));
    }
}
