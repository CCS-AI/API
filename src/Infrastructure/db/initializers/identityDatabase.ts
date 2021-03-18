import { Sequelize } from 'sequelize';
import { initPatient, initUser } from '../../../domains/identity/models';

class identityDatabase {
    static initModels(sequelize: Sequelize) {
        initUser(sequelize);
        initPatient(sequelize);
    }
}

export default identityDatabase;
