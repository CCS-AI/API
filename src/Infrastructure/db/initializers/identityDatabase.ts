import { Sequelize } from 'sequelize';
import { initPatientMedicalFile, initUser } from '../../../domains/identity/models';

class identityDatabase {
    static initModels(sequelize: Sequelize) {
        initUser(sequelize);
        initPatientMedicalFile(sequelize);
    }
}

export default identityDatabase;
