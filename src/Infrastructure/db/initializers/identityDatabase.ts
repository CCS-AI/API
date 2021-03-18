import { Sequelize } from 'sequelize';
import { initPatient, initPatientMedicalFile, initUser } from '../../../domains/identity/models';

class identityDatabase {
    static initModels(sequelize: Sequelize) {
        initUser(sequelize);
        initPatientMedicalFile(sequelize);
        initPatient(sequelize);
    }
}

export default identityDatabase;
