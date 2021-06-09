import { DataTypes, Model, Sequelize } from 'sequelize';
import { Questionnaire } from '../questionnaire/questionnaire';

class Question extends Model {
    public id: string;
    public name: string;
    public questionnaireid: string;
}

const attributes = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    },
    questionnaireid: {
        type: DataTypes.UUIDV4,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    }
};

const initQuestion = (sequelize: Sequelize): void => {
    Question.init(attributes, {
        sequelize,
        tableName: 'question',
        timestamps: true
    });
    Questionnaire.hasOne(Question, {
        foreignKey: 'id',
        sourceKey: 'questionnaireid',
        as: 'questionnaireid'
    });
};

export { Question, initQuestion };
