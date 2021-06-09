import { DataTypes, Model, Sequelize } from 'sequelize';

class Questionnaire extends Model {
    public id: string;
    public name: string;
}

const attributes = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    }
};

const initQuestionnaire = (sequelize: Sequelize): void => {
    Questionnaire.init(attributes, {
        sequelize,
        tableName: 'questionnaire',
        timestamps: true
    });
};

export { Questionnaire, initQuestionnaire };
