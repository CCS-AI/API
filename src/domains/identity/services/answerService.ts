import { container } from 'tsyringe';
import { Answer } from '../models/answer/answer';
import { IUserService } from './userService';

export interface IAnswerService {
    getById(nswerId: string): Promise<Answer | null>;
    getAllByPmf(pmfId: string): Promise<Answer[] | null>;

    create(answer: Answer): Promise<void>;
    update(answerId: string, answer: Answer): Promise<void>;
}

class AnswerService implements IAnswerService {
    private userService: IUserService;
    constructor() {
        this.userService = container.resolve<IUserService>('IUserService');
    }
    async getAllByPmf(pmfId: string): Promise<Answer[] | null> {
        const answers = await Answer.findAll({ where: { pmfId } });
        return answers;
    }
    async getById(answerId: string): Promise<Answer | null> {
        const answer = await Answer.findOne({ where: { id: answerId } });
        return answer;
    }
    async create(answer: Answer): Promise<void> {
        await Answer.create(answer);
    }
    async update(answerId: string, answer: Answer): Promise<void> {
        await Answer.update(answer, { where: { id: answerId } });
    }
}
export default AnswerService;
