import { Logger as consoleLog } from '@overnightjs/logger';
import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { container } from 'tsyringe';
import { inspect } from 'util';
import { LogzioLogger } from '../logging/logzio';

function routeErrorHandling(error: Error, request: Request, response: Response, next?: NextFunction) {
    const logger = container.resolve<LogzioLogger>('ILogger');

    consoleLog.Err(`${error}. ${request.originalUrl}. ${request.method}`);

    logger.error({
        url: request.originalUrl,
        action: request.method,
        error: inspect(error)
    });

    return response.status(INTERNAL_SERVER_ERROR).json({
        errorMessage: error.message
    });
}

export default routeErrorHandling;
