import { LoggerModes } from '@overnightjs/logger';
import * as fs from 'fs';
import * as path from 'path';
import 'reflect-metadata';
// Import and start Server. Remember, server must
// be imported after configuring env variables
import App from './app';
import './Infrastructure/devenv/env';

// Load env variables from .env file
console.log(`Current NODE_ENV is ${process.env.NODE_ENV}`);

// Set env variables
const logFilePath = path.join(__dirname, '../logs.log');
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.Console;
process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP = 'false';

// Remove current log file
(function removeFile() {
    try {
        fs.unlinkSync(logFilePath);
    } catch (e) {
        return;
    }
})();

const server = new App();

server.start();
