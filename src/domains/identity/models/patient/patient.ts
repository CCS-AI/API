import { DataTypes, Model, Sequelize } from 'sequelize';
import { PatientMedicalFile } from '../patientMedicalFile/patientMedicalFile';

export enum Gender {
    MALE = 1,
    FEMALE
}

export enum HMO {
    CLALIT = 1,
    MACABI,
    LEUMIT
}

class Patient extends Model {
    public id: string;
    public firstName: string;
    public lastName: string;
    public gender: Gender;
    public birth: Date;
    public address: string;
    public phone1: string;
    public phone2: string;
    public email: string;
    public hmo: HMO;
    public organizationId: string;
    public personalId: string;
    public createdAt: Date;
    public updatedAt: Date;
}

const attributes = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING,
        field: 'last_name'
    },
    gender: {
        type: DataTypes.NUMBER
    },
    birth: {
        type: DataTypes.DATE
    },
    address: {
        type: DataTypes.STRING
    },
    phone1: {
        type: DataTypes.STRING
    },
    phone2: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    hmo: {
        type: DataTypes.NUMBER
    },
    organizationId: {
        type: DataTypes.UUID,
        field: 'organization_id',
        allowNull: false
    },
    personalId: {
        type: DataTypes.NUMBER,
        field: 'personal_id'
    }
};

const initPatient = (sequelize: Sequelize): void => {
    Patient.init(attributes, {
        sequelize,
        tableName: 'patients',
        timestamps: true
    });
    Patient.hasOne(PatientMedicalFile, {
        foreignKey: 'patientId',
        sourceKey: 'id',
        as: 'pmf'
    });
    PatientMedicalFile.hasOne(Patient, {
        foreignKey: 'id',
        sourceKey: 'patientId',
        as: 'patient'
    });
};

export { Patient, initPatient };
