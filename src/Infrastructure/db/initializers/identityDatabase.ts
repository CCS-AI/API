import { Sequelize } from 'sequelize';
import { initOrganization, initPatient, initPatientMedicalFile, initUser } from '../../../domains/identity/models';

class identityDatabase {
    static initModels(sequelize: Sequelize) {
        initUser(sequelize);
        initPatientMedicalFile(sequelize);
        initPatient(sequelize);
        initOrganization(sequelize);
    }
}

export default identityDatabase;
