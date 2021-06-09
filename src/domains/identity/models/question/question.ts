import { DataTypes, Model, Sequelize } from 'sequelize';

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
};

export { Question, initQuestion };
