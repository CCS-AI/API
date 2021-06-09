import { DataTypes, Model, Sequelize } from 'sequelize';
type question = {
    name: string;
    answers: string[];
};
type questionnaireResult = Array<question>;

class QuestionnaireResult extends Model {
    public id: string;
    public data: questionnaireResult;
}

const attributes = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    },
    data: {
        type: DataTypes.JSON
    }
};

const initQuestionnaireResult = (sequelize: Sequelize): void => {
    QuestionnaireResult.init(attributes, {
        sequelize,
        tableName: 'questionnaireresult',
        timestamps: true
    });
};

export { QuestionnaireResult, initQuestionnaireResult };
