import { Sequelize } from 'sequelize';
import { container } from 'tsyringe';
import { User } from '../models/user/user';
import { filterType, rangeType, sortType } from '../../../controllers/admin/utils/index';
import { Examiner } from '../models/examiner/examiner';
import { IUserService } from './userService';

export interface IExaminerService {
    getById(examinerId: string): Promise<Examiner | null>;
    getByUserId(userId: string): Promise<Examiner | null>;
    getAll(): Promise<Examiner[] | null>;
    create(examiner: Examiner): Promise<void>;
    register(user: User, licenseNumber: string): Promise<void>;
    update(examinerId: string, examiner: Examiner): Promise<void>;
}

class ExaminerService implements IExaminerService {
    private userService: IUserService;
    constructor() {
        this.userService = container.resolve<IUserService>('IUserService');
    }
    async getById(examinerId: string): Promise<Examiner | null> {
        const examiner = await Examiner.findOne({ where: { id: examinerId } });
        return examiner;
    }
    async getByUserId(userId: string): Promise<Examiner | null> {
        const examiner = await Examiner.findOne({ where: { userId } });
        return examiner;
    }
    async getAll(): Promise<Examiner[] | null> {
        const examiners = await Examiner.findAll({
            attributes: [
                ...Object.keys(Examiner.rawAttributes),
                [Sequelize.col('user.email'), 'email'],
                [Sequelize.col('user.first_name'), 'firstName'],
                [Sequelize.col('user.last_name'), 'lastName']
            ],
            include: [
                {
                    model: User,
                    as: 'user',
                    required: true,
                    attributes: []
                }
            ]
        });
        return examiners;
    }
    async create(examiner: Examiner): Promise<void> {
        await Examiner.create(examiner);
    }
    async update(examinerId: string, examiner: Examiner): Promise<void> {
        await Examiner.update(examiner, { where: { id: examinerId } });
    }
    async register(user: User, licenseNumber: string): Promise<void> {
        const createdUser = await this.userService.createUser(user);
        await this.create({ userId: createdUser.id, licenseNumber } as Examiner);
    }
}
export default ExaminerService;
