import { Sequelize } from 'sequelize';
import { initExamination } from 'src/domains/identity/models/examination/examination';
import { initExaminer } from 'src/domains/identity/models/examiner/examiner';
import { initOrganization, initPatient, initPatientMedicalFile, initUser } from '../../../domains/identity/models';

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
