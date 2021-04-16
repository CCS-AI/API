import { Sequelize } from 'sequelize';

import { initOrganization, initPatient, initPatientMedicalFile, initUser, initExaminer, initExamination } from '../../../domains/identity/models';

class identityDatabase {
    static initModels(sequelize: Sequelize) {
        initUser(sequelize);
        initPatientMedicalFile(sequelize);
        initPatient(sequelize);
        initOrganization(sequelize);
        initExaminer(sequelize);
        initExamination(sequelize);
    }
}

export default identityDatabase;
