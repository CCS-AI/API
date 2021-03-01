import { Logger as ConsoleLog } from '@overnightjs/logger';
import { Error, Sequelize } from 'sequelize';
import identityDatabase from './initializers/identityDatabase';

export default class Database {
    private baseDbConfig: any = {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
    };

    private identityConfig = {
        ...this.baseDbConfig,
        database: process.env.DEFAULT_DATABASE_NAME
    };

    public sequelize: Sequelize;

    public constructor() {
        ConsoleLog.Info('initDatabase');
        this.connect();
        this.verifyPublicDBConnection();

        identityDatabase.initModels(this.sequelize);
    }

    public connect(): void {
        this.sequelize = new Sequelize(this.identityConfig);
    }

    public verifyPublicDBConnection(): void {
        this.sequelize
            .authenticate()
            .then((): void => {
                ConsoleLog.Info(`Connection successful on public database: ${this.sequelize.config.database}`);
            })
            .catch((error: Error): void => {
                ConsoleLog.Err(`Connection failed on public database: ${this.sequelize.config.database}, ${error.message}`);
            });
    }
}
