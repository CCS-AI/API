import { DataTypes, Model, Sequelize } from 'sequelize';

class UserLogin extends Model {
    private id: number;
    public userId: string;
    public ip: string;
    public userAgent: string;
    public loginDate: Date;
    public type: string;
    public token: JSON;

    get Id() {
        return this.id;
    }
}

const attributes = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        field: 'user_id',
        type: DataTypes.UUIDV4,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING
    },
    userAgent: {
        field: 'user_agent',
        type: DataTypes.STRING,
        allowNull: false
    },
    loginDate: {
        field: 'login_date',
        allowNull: true,
        type: DataTypes.DATE
    },
    token: {
        type: DataTypes.JSON,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING
    }
};

const initUserLogin = (sequelize: Sequelize): void => {
    UserLogin.init(attributes, {
        sequelize,
        tableName: 'users_login_records',
        timestamps: false,
    });
};

export { UserLogin, initUserLogin };
