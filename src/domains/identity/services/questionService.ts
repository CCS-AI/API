import { container } from 'tsyringe';
import { Question } from '../models/question/question';
import { IUserService } from './userService';

export interface IQuestionService {
    getById(nswerId: string): Promise<Question | null>;
    getAllByPmf(pmfId: string): Promise<Question[] | null>;

    create(question: Question): Promise<void>;
    update(questionId: string, question: Question): Promise<void>;
}

class QuestionService implements IQuestionService {
    private userService: IUserService;
    constructor() {
        this.userService = container.resolve<IUserService>('IUserService');
    }
    async getAllByPmf(pmfId: string): Promise<Question[] | null> {
        const questions = await Question.findAll({ where: { pmfId } });
        return questions;
    }
    async getById(questionId: string): Promise<Question | null> {
        const question = await Question.findOne({ where: { id: questionId } });
        return question;
    }
    async create(question: Question): Promise<void> {
        await Question.create(question);
    }
    async update(questionId: string, question: Question): Promise<void> {
        await Question.update(question, { where: { id: questionId } });
    }
}
export default QuestionService;
