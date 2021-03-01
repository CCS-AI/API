import { Sequelize } from 'sequelize';
import {
    initUser,
} from '../../../domains/identity/models';

class identityDatabase {
    static initModels(sequelize: Sequelize) {
        initUser(sequelize);
    }
}

export default identityDatabase;
