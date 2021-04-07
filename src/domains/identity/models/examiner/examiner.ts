import { DataTypes, Model, Sequelize } from 'sequelize';

class Examiner extends Model {
    public id: string;
    public userId: string;
    public licenseNumber: string;
}

const attributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    },
    userId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        field: 'user_id'
    },
    licenseNumber: {
        type: DataTypes.NUMBER,
        field: 'license_number'
    }
};

const initExaminer = (sequelize: Sequelize): void => {
    Examiner.init(attributes, {
        sequelize,
        tableName: 'examiners',
        timestamps: true
    });
};

export { Examiner, initExaminer };
