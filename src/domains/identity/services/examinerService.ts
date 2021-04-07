import { createExaminer } from 'src/Infrastructure/schemas/examiner/createExaminer';
import { User } from '../models/user/user';
import { filterType, rangeType, sortType } from '../../../controllers/admin/utils/index';
//import { examiner } from '../models';
import { Examiner } from '../models/examiner/examiner';

export interface IExaminerService {
    getById(ExaminerId: string): Promise<Examiner | null>;
    getByEmail(email: string): Promise<Examiner | null>;
    getAll(): Promise<Examiner[] | null>;
    create(Examiner: Examiner): Promise<void>;
    register(user: User, licenseNumber: string): Promise<void>;
    update(examinerId: string, examiner: Examiner): Promise<void>;
}

class ExaminerService implements IExaminerService {
    // userService: any; //ask Eliel--------------------------------------
    async getById(examinerId: string): Promise<Examiner | null> {
        const examiner = await Examiner.findOne({ where: { id: examinerId } });
        return examiner;
    }
    async getByEmail(email: string): Promise<Examiner | null> {
        const examiner = await Examiner.findOne({ where: { email } });
        return examiner;
    }
    async getAll(): Promise<Examiner[] | null> {
        const examiners = await Examiner.findAll();
        return examiners;
    }
    async create(examiner: Examiner): Promise<void> {
        await Examiner.create(examiner);
    }
    async update(examinerId: string, examiner: Examiner): Promise<void> {
        await Examiner.update(examiner, { where: { id: examinerId } });
    }
    async register(user: User, licenseNumber: string): Promise<void> {
        // const userT = await this.userService.createUser(user);
        // await this.create(Examiner.build({ userId: userT.Id, licenseNumber }));
    }
}
export default ExaminerService;