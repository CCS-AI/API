import { Op, Sequelize } from 'sequelize';
import { container } from 'tsyringe';
import { Examination, Patient } from '../models';
import { IPatientService } from './patientService';

type examinationType = 'AC' | 'AC+MASK' | 'BC' | 'BC+MASK' | 'WEBER' | 'FF' | 'STENGER';

enum HMO {
    CLALIT = 1,
    MACABI,
    LEUMIT
}
type patientDetails = {
    gender: 'male' | 'female';
    yearOfBirth: number;
    examinationDate: Date;
    ageOnCreate: number;
    examiner: string;
    hmo: HMO;
};

type examinationResult = {
    frequency1: number;
    frequency2: number;
    type: examinationType;
    operation: '<' | '>' | '=';
    operationNumber: number;
};

export interface IFilter2Service {
    getAllAfterFiler(patientDetails: patientDetails, examinationResult: examinationResult): Promise<Patient[] | null>;
}

class Filter2Service implements IFilter2Service {
    private PatientService: IPatientService;
    constructor() {
        this.PatientService = container.resolve<IPatientService>('IPatientService');
    }
    async getAllAfterFiler(patientDetails: patientDetails, examinationResult: examinationResult): Promise<Patient[] | null> {
        const patients = Patient.findAll({ where: { patientDetails, examinationResult } });
        return patients;
    }
}
export default Filter2Service;
