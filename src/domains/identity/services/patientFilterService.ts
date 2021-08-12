import { Op } from 'sequelize';
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
        yearOfBirth: number;
        examinationDate: Date;
        hmo: HMO;
    };
    examinationResult?: {
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
        return where;
    }
}
export default PatientFilterService;
