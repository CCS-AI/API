import { hashSync } from 'bcrypt';
import { DataTypes, Model, Sequelize } from 'sequelize';

//at least 8 characters, at least 1 lowercase, at least 1 uppercase, at least 1 numeric character
const PASSWORD_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';

const EMAIL_REGEXP = '/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/';

class User extends Model {
    private id: string;
    private email: string;
    private password: string;

    public username: string;
    public firstName: string;
    public lastName: string;
    public role: string;
    public phoneNumber: string;
    public birthDate: Date;
    public createdDate: Date;
    public profileImg: string;
    public shouldResetPassword: boolean;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date;

    get Id() {
        return this.id;
    }

    get Password() {
        return this.password;
    }

    set Password(password: string) {
        this.password = password;
    }

    get Email() {
        return this.email;
    }

    set Email(email: string) {
        if (!email.match(EMAIL_REGEXP)) throw new Error('Invalid email');

        this.email = email;
    }

    get FullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

const hooks = {
    beforeCreate: (user: User): void => {
        if (!user.Password.match(PASSWORD_REGEX)) throw new Error('Invalid password');

        user.Password = hashSync(user.Password, 10);
    },
    //TO-DO: NOT WORKING. FIX!
    beforeUpdate: (user: User): void => {
        if (!user.Password.match(PASSWORD_REGEX)) throw new Error('Invalid password');
        user.Password = hashSync(user.Password, 10);
    }
};

const attributes = {
    id: {
        field: 'id',
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        field: 'first_name',
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        field: 'last_name',
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
    },
    phoneNumber: {
        field: 'phone_number',
        type: DataTypes.STRING,
    },
    birthDate: {
        field: 'birth_date',
        type: DataTypes.DATE,
    },
    profileImg: {
        field: 'user_pic',
        type: DataTypes.UUIDV4,
    },
    shouldResetPassword: {
        field: 'should_reset_password',
        type: DataTypes.BOOLEAN
    },
};

const initUser = (sequelize: Sequelize): void => {
    User.init(attributes, {
        sequelize,
        tableName: 'users',
        hooks,
        paranoid: true,
        timestamps:true,
    });
};

export { User, initUser };
