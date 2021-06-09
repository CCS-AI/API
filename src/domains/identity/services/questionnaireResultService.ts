import { container } from 'tsyringe';
import { QuestionnaireResult } from '../models/questionnaireResult/questionnaireResult';
import { IUserService } from './userService';

export interface IQuestionnaireResultService {
    getById(nswerId: string): Promise<QuestionnaireResult | null>;
    getAllByPmf(pmfId: string): Promise<QuestionnaireResult[] | null>;

    create(questionnaireResult: QuestionnaireResult): Promise<void>;
    update(questionnaireResultId: string, questionnaireResult: QuestionnaireResult): Promise<void>;
}

class QuestionnaireResultService implements IQuestionnaireResultService {
    private userService: IUserService;
    constructor() {
        this.userService = container.resolve<IUserService>('IUserService');
    }
    async getAllByPmf(pmfId: string): Promise<QuestionnaireResult[] | null> {
        const questionnaireResults = await QuestionnaireResult.findAll({ where: { pmfId } });
        return questionnaireResults;
    }
    async getById(questionnaireResultId: string): Promise<QuestionnaireResult | null> {
        const questionnaireResult = await QuestionnaireResult.findOne({ where: { id: questionnaireResultId } });
        return questionnaireResult;
    }
    async create(questionnaireResult: QuestionnaireResult): Promise<void> {
        await QuestionnaireResult.create(questionnaireResult);
    }
    async update(questionnaireResultId: string, questionnaireResult: QuestionnaireResult): Promise<void> {
        await QuestionnaireResult.update(questionnaireResult, { where: { id: questionnaireResultId } });
    }
}
export default QuestionnaireResultService;
