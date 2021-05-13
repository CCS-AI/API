//import { HelpFunctions } from './controllers/utils/helpFunctions';
import { Server } from '@overnightjs/core';
import { Logger as ConsoleLog } from '@overnightjs/logger';
import * as bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Request, Response } from 'express';
import helmet from 'helmet';
import multer from 'multer';
import { container } from 'tsyringe';
import * as controllers from './controllers';
import UserBounded from './domains/identity/models/user/userBounded';

import AuthService from './domains/identity/services/authService';
import ExaminationService from './domains/identity/services/examinationService';

import ExaminerService from './domains/identity/services/examinerService';
import PatientMedicalFileService from './domains/identity/services/patientMedicalFileService';
import PatientService from './domains/identity/services/patientService';
import UserService from './domains/identity/services/userService';
import Database from './Infrastructure/db/sequelize';
import EmailService from './Infrastructure/emailService/emailService';
import fatalErrorHandling from './Infrastructure/exceptions/fatalErrorHandling';

import { LogzioLogger } from './Infrastructure/logging/logzio';

const upload = multer();

class App extends Server {
    private readonly FRONT_END_MSG = 'API started.';
    private readonly START_MSG = 'API started on port: ';

    constructor() {
        super(true);
        this.app
            .use(bodyParser.json({ limit: '10MB' }))
            .use(bodyParser.urlencoded({ extended: true }))
            .use(upload.any())
            .use(
                cors({
                    origin: [/^(http[s]?:\/\/)[a-zA-Z\-]+\.DOMAINANME.(ai|net)$/, 'http://localhost:3000', 'http://localhost:3001'],
                    credentials: true
                })
            )
            .use(compress({}))
            .use(cookieParser())
            .use(helmet());

        process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
            fatalErrorHandling(reason);
        });

        process.on('uncaughtException', (error: Error) => {
            fatalErrorHandling(error);
        });

        //TO-DO: Improve
        process.on('SIGINT', function onSigint() {
            ConsoleLog.Err('SIGINT!!!');
            process.exit();
        });

        process.on('SIGTERM', function onSigterm() {
            ConsoleLog.Err('SIGTERM!!!');
            process.exit();
        });
        this.registerDepandencies();
        this.reqisterEventHandlers();
        this.setupControllers();
    }

    private registerDepandencies(): void {
        //Infra
        //Singletons
        const logzio = new LogzioLogger();
        container.registerInstance('ILogger', logzio);

        const emailService = new EmailService();
        container.registerInstance('IEmailService', emailService);

        const db = new Database();
        container.registerInstance('database', db);

        const userBounded = new UserBounded();
        container.registerInstance('UserBounded', userBounded);

        //Services
        container.register('IUserService', {
            useClass: UserService
        });
        container.register('IAuthService', {
            useClass: AuthService
        });
        container.register('IPatientService', {
            useClass: PatientService
        });
        container.register('IPatientMedicalFileService', {
            useClass: PatientMedicalFileService
        });
        container.register('IExaminerService', {
            useClass: ExaminerService
        });
        container.register('IExaminationService', {
            useClass: ExaminationService
        });
        //Helpers
        // container.register('IhelpFunctions', {
        //     useClass: HelpFunctions
        // });
    }
    }

    private setupControllers(): void {
        const controllerInstances = [];
        for (const name of Object.keys(controllers)) {
            const controller = (controllers as any)[name];
            if (typeof controller === 'function') {
                const serviceInstance = container.resolve(controller);
                controllerInstances.push(serviceInstance);
            }
        }

        super.addControllers(controllerInstances);
    }

    private async reqisterEventHandlers() {
        //
    }

    public start(): void {
        const port: number = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000;

        this.app.get('/', (req: Request, res: Response) => {
            res.send(this.FRONT_END_MSG);
        });

        const server = this.app.listen(port, () => {
            ConsoleLog.Imp(this.START_MSG + port);
        });
    }
}

export default App;
