import { Op, Sequelize } from 'sequelize';
import { PatientMedicalFile } from '../models';
import { Examination, examinationType } from './../models/examination/examination';
import { HMO, Gender, Patient } from './../models/patient/patient';
import { QuestionnaireResult, questionnaireResult } from './../models/questionnaireResult/questionnaireResult';

type filterType = baseFilterType & {
    organizationId: string;
};

export type baseFilterType = {
    questionnaireResult?: questionnaireResult;
    patientDetails?: {
        gender: Gender;
        yearOfBirth: number; // problem
        hmo: HMO;
    };
    examinationResult?: {
        examinationDate: Date;
        frequency1: number;
        frequency2: number;
        type: examinationType;
        operation: '<' | '>' | '=';
        operationNumber: number;
        ageOnCreate: number;
        examiner: string;
    };
};

export interface IPatientFilterService {
    getPatientsByFilter(filter: filterType): Promise<Patient[]>;
}

class PatientFilterService implements IPatientFilterService {
    async getPatientsByFilter(filter: filterType): Promise<Patient[]> {
        const patients = await Patient.findAll({
            where: this.generateWhereExpression(filter),
            include: [
                {
                    model: PatientMedicalFile,
                    as: 'pmf',
                    attributes: [],
                    include: [
                        {
                            model: Examination,
                            as: 'examinations',
                            attributes: [],
                            include: [
                                {
                                    model: QuestionnaireResult,
                                    as: 'questionnaireResults',
                                    attributes: []
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return patients;
    }
    private generateWhereExpression(filter: filterType) {
        const { organizationId, questionnaireResult, patientDetails, examinationResult } = filter;
        const where: { [key: string]: any } = { organizationId };
        if (questionnaireResult) {
            const containAnswers = questionnaireResult.filter((result) => result?.answers?.length);
            if (containAnswers.length) where['$pmf.examinations.questionnaireResults.data$'] = { [Op.contains]: JSON.stringify(containAnswers) };
        }

        if (patientDetails) {
            console.log(patientDetails);
            where.gender = patientDetails.gender;
            // where.$and =Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('dateField')),2020); ---
            where.hmo = patientDetails.hmo;
        }
        if (examinationResult) {
            console.log(examinationResult);
            // where['$pmf.examinations.createdAt$'] = examinationResult.examinationDate; -- same problem of patient date
            //where['$pmf.examinations.info.type$'] = { [Op.contains]: examinationResult.type };
            where['$pmf.examinations.examiner_id$'] = examinationResult.examiner;
            where['$pmf.examinations.age_on_create$'] = examinationResult.ageOnCreate;
        }
        return where;
    }
}
export default PatientFilterService;
