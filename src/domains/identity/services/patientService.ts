import { User } from '../models/user/user';
import { filterType, rangeType, sortType } from '../../../controllers/admin/utils/index';
import { Patient } from '../models';

export interface IPatientService {
    getById(patientId: string): Promise<Patient | null>;
    getByEmail(email: string): Promise<Patient | null>;
    getAll(): Promise<Patient[] | null>;
    create(patient: Patient): Promise<void>;
    update(patientId: string, patient: Patient): Promise<void>;
}

class PatientService implements IPatientService {
    async getById(patientId: string): Promise<Patient | null> {
        const patient = await Patient.findOne({ where: { id: patientId } });
        return patient;
    }
    async getByEmail(email: string): Promise<Patient | null> {
        const patient = await Patient.findOne({ where: { email } });
        return patient;
    }
    async getAll(): Promise<Patient[] | null> {
        const patients = await Patient.findAll();
        return patients;
    }
    async create(patient: Patient): Promise<void> {
        await Patient.create(patient);
    }
    async update(patientId: string, patient: Patient): Promise<void> {
        await Patient.update(patient, { where: { id: patientId } });
    }
}
export default PatientService;
