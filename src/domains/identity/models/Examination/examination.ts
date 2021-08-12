import { DataTypes, Model, Sequelize } from 'sequelize';
import { Examiner } from '../examiner/examiner';
import { PatientMedicalFile } from '../patientMedicalFile/patientMedicalFile';
import { QuestionnaireResult } from '../questionnaireResult/questionnaireResult';

export type examinationType = 'AC' | 'AC+MASK' | 'BC' | 'BC+MASK' | 'WEBER' | 'FF' | 'STENGER';

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
        Rt: number;
        Lt: number;
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
    isNoResponse: boolean;
};

class Examination extends Model {
    public id: string;
    public pmfId: string;
    public createdAt: Date;
    public updatedAt: Date;
    public info: Array<examResult>;
    public speechAudiometry: speechAudiometry;
    public patientTestBackground: string;
    public summary: string;
    public questionnaireResultId: string;
    public ageOnCreate: number;
    public examinerId: string;
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
        type: DataTypes.JSONB,
        allowNull: false
    },
    speechAudiometry: {
        field: 'speech_audiometry',
        type: DataTypes.JSONB
    },
    patientTestBackground: {
        field: 'patient_test_background',
        type: DataTypes.STRING
    },
    summary: {
        type: DataTypes.STRING
    },
    questionnaireResultId: {
        field: 'questionnaire_result_id',
        type: DataTypes.UUIDV4
    },
    ageOnCreate: {
        field: 'age_on_create',
        type: DataTypes.NUMBER
    },
    examinerId: {
        field: 'examiner_id',
        type: DataTypes.UUIDV4
    }
};

const initExamination = (sequelize: Sequelize): void => {
    Examination.init(attributes, {
        sequelize,
        tableName: 'examination',
        timestamps: true
    });
    PatientMedicalFile.hasMany(Examination, {
        as: 'examinations',
        foreignKey: 'pmfId',
        sourceKey: 'id'
    });
    Examination.hasOne(QuestionnaireResult, {
        as: 'questionnaireResults',
        foreignKey: 'id',
        sourceKey: 'questionnaireResultId'
    });
    Examination.hasOne(Examiner, {
        as: 'examiner',
        foreignKey: 'id',
        sourceKey: 'examinerId'
    });
};

export { Examination, initExamination };
