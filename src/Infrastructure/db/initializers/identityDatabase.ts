import { Sequelize } from 'sequelize';

import {
    initOrganization,
    initPatient,
    initPatientMedicalFile,
    initUser,
    initExaminer,
    initExamination,
    initQuestionnaireResult,
    initQuestionnaire,
    initQuestion,
    initAnswer
} from '../../../domains/identity/models';

class identityDatabase {
    static initModels(sequelize: Sequelize) {
        initUser(sequelize);
        initPatientMedicalFile(sequelize);
        initPatient(sequelize);
        initOrganization(sequelize);
        initExaminer(sequelize);
        initQuestionnaireResult(sequelize);
        initExamination(sequelize);
        initQuestionnaire(sequelize);
        initQuestion(sequelize);
        initAnswer(sequelize);
    }
}

export default identityDatabase;
