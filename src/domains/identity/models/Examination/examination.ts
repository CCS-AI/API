import { DataTypes, Model, Sequelize } from 'sequelize';

type examinationType = 'AC' | 'AC+MASK' | 'BC' | 'BC+MASK' | 'WEBER' | 'NO_RESPONSE' | 'FF' | 'STENGER';

type sp = {
    Rt: number; // between 0-120
    MaskRt: number; // between 0-120
    Lt: number; // between 0-120
    MaskLt: number; // between 0-120
    SF: string;
};

type speechAudiometry = {
    SRT_db: sp;
    Disc: {
        Rt: [0, 1];
        Lt: [0, 1];
    };
    dB: sp;
    MCL: sp;
    UCL: sp;
    VDL: {
        Rt: number; // between 0-120
        Lt: number; // between 0-120
    };
};

type examResult = {
    x: number;
    y: number;
    ear: 'RIGHT' | 'LEFT';
    type: examinationType;
};

class Examination extends Model {
    public id: string;
    public pmfId: string;
    public createdAt: Date;
    public updatedAt: Date;
    public info: Array<examResult>;
    public speechAudiometry: speechAudiometry;
    public patientTestBackground: string;
}

const attributes = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    },
    pmfId: {
        field: 'pmf_id',
        type: DataTypes.UUIDV4,
        allowNull: false
    },
    info: {
        type: DataTypes.JSON,
        allowNull: false
    },
    speechAudiometry: {
        field: 'speech_audiometry',
        type: DataTypes.JSON
    },
    patientTestBackground: {
        field: 'patient_test_background',
        type: DataTypes.STRING
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
