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
        initExamination(sequelize);
        initQuestionnaireResult(sequelize);
        initQuestionnaire(sequelize);
        initQuestion(sequelize);
        initAnswer(sequelize);
    }
}

export default identityDatabase;
