import { DataTypes, Model, Sequelize } from 'sequelize';
import { Question } from '../question/question';

class Answer extends Model {
    public id: string;
    public name: string;
    public questionId: string;
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
    questionId: {
        field: 'question_id',
        type: DataTypes.UUIDV4,
        allowNull: false
    }
};

const initAnswer = (sequelize: Sequelize): void => {
    Answer.init(attributes, {
        sequelize,
        tableName: 'answer',
        timestamps: true
    });
    Question.hasMany(Answer, {
        as: 'answers',
        foreignKey: 'questionId',
        sourceKey: 'id'
    });
};

export { Answer, initAnswer };
