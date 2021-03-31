import { Op } from 'sequelize';
import { Lifecycle, scoped } from 'tsyringe';
import { User } from '../models/user/user';
import { filterType, rangeType, sortType } from './../../../controllers/admin/utils/index';

export interface IUserService {
    getById(userId: string): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    getUserDetailsById(userId: string): Promise<User | null>;
    getAll(filter?: filterType, range?: rangeType, sort?: sortType): Promise<User[]>;
    createUser(user: User): Promise<User>;
    updateUser(user: User): void;
}

@scoped(Lifecycle.ResolutionScoped)
class UserService implements IUserService {
    public async getById(userId: string): Promise<User | null> {
        const user = await User.findOne({ where: { id: userId } });

        return user;
    }

    public async getByEmail(email: string): Promise<User | null> {
        const user = User.findOne({ where: { email: email } });

        return user;
    }
    public async getUserDetailsById(userId: string): Promise<User | null> {
        const user = User.findOne({ where: { id: userId } });

        return user;
    }

    public async getAll(filter?: filterType, range?: rangeType, sort?: sortType): Promise<User[]> {
        const users = User.findAll({
            order: sort,
            offset: range?.offset,
            limit: range?.limit
        });

        return users;
    }

    public async createUser(user: User): Promise<User> {
        return await User.create({
            email: user.Email,
            password: user.Password,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phoneNumber: user.phoneNumber,
            birthDate: user.birthDate,
            organizationId: user.organizationId
        });
    }

    public async updateUser(user: User): Promise<void> {
        await User.update(
            {
                email: user.Email,
                password: user.Password,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phoneNumber: user.phoneNumber,
                birthDate: user.birthDate
            },
            {
                where: { id: user.Id }
            }
        );
    }
}
export default UserService;
