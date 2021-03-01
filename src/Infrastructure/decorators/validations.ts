import { Middleware } from '@overnightjs/core';
import { Logger as consoleLog } from '@overnightjs/logger';
import Ajv from 'ajv';
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import { container } from 'tsyringe';
import ValidateBodyException from '../exceptions/validateBodyException';
import { LogzioLogger } from '../logging/logzio';

export function ValidateBody(schema: any) {
    const ajv = new Ajv();
    function validate(req: Request, res: Response, next: NextFunction) {
        const validator = ajv.compile(schema); // pay compilation because we dont want to share instance
        if (!validator(req.body)) {
            const vbe = new ValidateBodyException(validator.errors);

            const logger = container.resolve<LogzioLogger>('ILogger');

            consoleLog.Err(`${vbe}. ${req.originalUrl}. ${req.method}`);

            logger.error(`ValidateBodyException! url:${req.originalUrl}.  Error: ${JSON.stringify(vbe)}`);

            return res.status(BAD_REQUEST).json(vbe);
        }
        next();
    }

    return Middleware(validate);
}
