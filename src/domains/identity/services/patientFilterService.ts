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
        yearOfBirth: number; //TODO - implement
        hmo: HMO;
    };
    examinationResult?: {
        examinationDate: Date;
        frequency1: number; //TODO - implement
        frequency2: number; //TODO - implement
        type: examinationType; //TODO - implement
        operation: '<' | '>' | '='; //TODO - implement
        operationNumber: number; //TODO - implement
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
            if (patientDetails.gender) where.gender = patientDetails.gender;
            if (patientDetails.hmo) where.hmo = patientDetails.hmo;
        }
        if (examinationResult) {
            if (examinationResult.examinationDate) where['$pmf.examinations.createdAt$'] = examinationResult.examinationDate;
            if (examinationResult.examiner) where['$pmf.examinations.examiner_id$'] = examinationResult.examiner;
            if (examinationResult.ageOnCreate) where['$pmf.examinations.age_on_create$'] = examinationResult.ageOnCreate;
        }
        return where;
    }
}
export default PatientFilterService;
