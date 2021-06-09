import { container } from 'tsyringe';
import { Questionnaire } from '../models/questionnaire/questionnaire';
import { IUserService } from './userService';

export interface IQuestionnaireService {
    getById(nswerId: string): Promise<Questionnaire | null>;
    create(questionnaire: Questionnaire): Promise<void>;
    update(questionnaireId: string, questionnaire: Questionnaire): Promise<void>;
}

class QuestionnaireService implements IQuestionnaireService {
    private userService: IUserService;
    constructor() {
        this.userService = container.resolve<IUserService>('IUserService');
    }
    async getById(questionnaireId: string): Promise<Questionnaire | null> {
        const questionnaire = await Questionnaire.findOne({ where: { id: questionnaireId } });
        return questionnaire;
    }
    async create(questionnaire: Questionnaire): Promise<void> {
        await Questionnaire.create(questionnaire);
    }
    async update(questionnaireId: string, questionnaire: Questionnaire): Promise<void> {
        await Questionnaire.update(questionnaire, { where: { id: questionnaireId } });
    }
}
export default QuestionnaireService;
