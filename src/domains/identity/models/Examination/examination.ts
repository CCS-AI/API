import { DataTypes, Model, Sequelize } from 'sequelize';

type examinationType = 'AC' | 'AC+MASK' | 'BC' | 'BC+MASK' | 'WEBER' | 'NO_RESPONSE' | 'FF' | 'STENGER';

type examResult = {
    x: number;
    y: number;
    ear: 'RIGHT' | 'LEFT';
    type: examinationType;
};

class Examination extends Model {
    public id: string;
    public pmfid: string;
    public createdAt: Date;
    public updatedAt: Date;
    public info: Array<examResult>;
}

const attributes = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    },
    pmfid: {
        type: DataTypes.UUIDV4,
        allowNull: false
    },
    info: {
        type: DataTypes.JSON,
        allowNull: false
    }
};

const initExamination = (sequelize: Sequelize): void => {
    Examination.init(attributes, {
        sequelize,
        tableName: 'examination',
        timestamps: true
    });
};

export { Examination, initExamination };
