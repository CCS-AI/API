import { DataTypes, Model, Sequelize } from 'sequelize';

class PatientMedicalFile extends Model {
    public id: string;
    public patientId: string;
}

const attributes = {
    id: {
        type: DataTypes.UUIDV4,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    patientId: {
        field: 'patient_id',
        type: DataTypes.UUIDV4,
        allowNull: false
    }
};

const initPatientMedicalFile = (sequelize: Sequelize): void => {
    PatientMedicalFile.init(attributes, {
        sequelize,
        tableName: 'patient_medical_file',
        timestamps: true
    });
};

export { PatientMedicalFile, initPatientMedicalFile };
