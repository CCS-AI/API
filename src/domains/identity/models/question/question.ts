import { DataTypes, Model, Sequelize } from 'sequelize';
import { Questionnaire } from '../questionnaire/questionnaire';

class Question extends Model {
    public id: string;
    public name: string;
    public questionnaireId: string;
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
    },
    questionnaireId: {
        field: 'questionnaire_id',
        type: DataTypes.UUIDV4,
        allowNull: false
    }
};

const initQuestion = (sequelize: Sequelize): void => {
    Question.init(attributes, {
        sequelize,
        tableName: 'question',
        timestamps: true
    });
    Questionnaire.hasMany(Question, {
        as: 'questions',
        foreignKey: 'questionnaireId',
        sourceKey: 'id'
    });
};

export { Question, initQuestion };
