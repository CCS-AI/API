import { container } from 'tsyringe';
import { Examination } from '../models/examination/examination';
import { IUserService } from './userService';

export interface IExaminationService {
    getById(examinationId: string): Promise<Examination | null>;
    getAllByPmf(pmfId: string): Promise<Examination[] | null>;

    create(examination: Examination): Promise<void>;
    update(examinationId: string, examination: Examination): Promise<void>;
}

class ExaminationService implements IExaminationService {
    private userService: IUserService;
    constructor() {
        this.userService = container.resolve<IUserService>('IUserService');
    }
    async getAllByPmf(pmfId: string): Promise<Examination[] | null> {
        const examinations = await Examination.findAll({ where: { pmfid: pmfId } });
        return examinations;
    }
    async getById(examinationId: string): Promise<Examination | null> {
        const examination = await Examination.findOne({ where: { id: examinationId } });
        return examination;
    }
    async create(examination: Examination): Promise<void> {
        console.log('examinationService : examination', examination);
        await Examination.create(examination);
    }
    async update(examinationId: string, examination: Examination): Promise<void> {
        await Examination.update(examination, { where: { id: examinationId } });
    }
}
export default ExaminationService;
