import { questionnaireResult } from './../models/questionnaireResult/questionnaireResult';
import { container } from 'tsyringe';
import { QuestionnaireResult } from '../models';
import { Examination } from '../models/examination/examination';
import { IUserService } from './userService';

export interface IExaminationService {
    getById(examinationId: string): Promise<Examination | null>;
    getAllByPmf(pmfId: string): Promise<Examination[] | null>;

    create(examination: Examination, questionnaireResults?: questionnaireResult): Promise<void>;
    update(examinationId: string, examination: Examination): Promise<void>;
}

class ExaminationService implements IExaminationService {
    private userService: IUserService;
    constructor() {
        this.userService = container.resolve<IUserService>('IUserService');
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
                }
            ]
        });
        return examination;
    }
    async create(examination: Examination, questionnaireResults?: questionnaireResult): Promise<void> {
        const questionnaireResult = await QuestionnaireResult.create({ data: questionnaireResults });
        await Examination.create({ ...examination, questionnaireResultId: questionnaireResult.id });
    }
    async update(examinationId: string, examination: Examination): Promise<void> {
        await Examination.update(examination, { where: { id: examinationId } });
    }
}
export default ExaminationService;
