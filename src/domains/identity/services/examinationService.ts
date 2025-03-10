import { Sequelize } from 'sequelize';
import { questionnaireResult } from './../models/questionnaireResult/questionnaireResult';
import { container, inject } from 'tsyringe';
import { Examiner, QuestionnaireResult, User } from '../models';
import { Examination } from '../models/examination/examination';
import { IUserService } from './userService';
import PatientService, { IPatientService } from './patientService';
import { Patient } from '../models';

export interface IExaminationService {
    getById(examinationId: string): Promise<Examination | null>;
    getAllByPmf(pmfId: string): Promise<Examination[] | null>;

    create(examination: Examination, questionnaireResults?: questionnaireResult): Promise<void>;
    update(examinationId: string, examination: Examination): Promise<void>;
}

class ExaminationService implements IExaminationService {
    private userService: IUserService;
    private PatientService: IPatientService;
    constructor() {
        this.userService = container.resolve<IUserService>('IUserService');
        this.PatientService = container.resolve<IPatientService>('IPatientService');
    }
    async getAllByPmf(pmfId: string): Promise<Examination[] | null> {
        const examinations = await Examination.findAll({ where: { pmfId } });
        return examinations;
    }
    async getById(examinationId: string): Promise<Examination | null> {
        const examination = await Examination.findOne({
            where: { id: examinationId },
            include: [
                {
                    model: QuestionnaireResult,
                    as: 'questionnaireResults'
                },
                {
                    model: Examiner,
                    as: 'examiner',
                    attributes: ['licenseNumber'],
                    include: [
                        {
                            model: User,
                            as: 'user',
                            required: true,
                            attributes: ['email', 'firstName', 'lastName']
                        }
                    ]
                }
            ]
        });
        if (!examination) return null;
        return {
            ...examination.get(),
            examiner: examination.get().examiner
                ? {
                      licenseNumber: examination.get().examiner?.get().licenseNumber,
                      ...examination.get().examiner?.get().user?.get()
                  }
                : null
        };
    }
    public ageFromDateOfBirthday(dateOfBirth: any): number {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }
    async create(examination: Examination, questionnaireResults?: questionnaireResult): Promise<void> {
        const questionnaireResult = await QuestionnaireResult.create({ data: questionnaireResults });
        const patient = await this.PatientService.getByPmfId(examination.pmfId);
        const age = this.ageFromDateOfBirthday(patient?.birth);
        await Examination.create({ ...examination, questionnaireResultId: questionnaireResult.id, ageOnCreate: age });
    }
    async update(examinationId: string, examination: Examination): Promise<void> {
        await Examination.update(examination, { where: { id: examinationId } });
    }
}
export default ExaminationService;
