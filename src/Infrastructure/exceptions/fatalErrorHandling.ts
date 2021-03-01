import { container } from 'tsyringe';
import { LogzioLogger } from '../logging/logzio';

function fatalErrorHandling(error: Error) {
    const logger = container.resolve<LogzioLogger>('ILogger');

    logger.error(error);
}

export default fatalErrorHandling;
