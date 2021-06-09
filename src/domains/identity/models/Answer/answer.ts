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
    questionnaireid: {
        type: DataTypes.UUIDV4,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    }
};

const initAnswer = (sequelize: Sequelize): void => {
    Answer.init(attributes, {
        sequelize,
        tableName: 'question',
        timestamps: true
    });
    Question.hasOne(Answer, {
        foreignKey: 'id',
        sourceKey: 'questionId',
        as: 'questionId'
    });
};

export { Answer, initAnswer };
