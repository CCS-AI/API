import { Sequelize } from 'sequelize';
import { initExaminer } from 'src/domains/identity/models/examiner/examiner';
import { initOrganization, initPatient, initPatientMedicalFile, initUser } from '../../../domains/identity/models';

class identityDatabase {
    static initModels(sequelize: Sequelize) {
        initUser(sequelize);
        initPatientMedicalFile(sequelize);
        initPatient(sequelize);
        initOrganization(sequelize);
        initExaminer(sequelize);
    }
}

export default identityDatabase;
