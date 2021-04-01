import { container } from 'tsyringe';
import { User } from '../models/user/user';
import { filterType, rangeType, sortType } from '../../../controllers/admin/utils/index';
import { Patient, PatientMedicalFile } from '../models';
import UserBounded from '../models/user/userBounded';

export interface IPatientService {
    getById(patientId: string): Promise<Patient | null>;
    getByEmail(email: string): Promise<Patient | null>;
    getAll(): Promise<Patient[] | null>;
    create(patient: Patient): Promise<void>;
    update(patientId: string, patient: Patient): Promise<void>;
}

class PatientService implements IPatientService {
    private userBounded: UserBounded;
    constructor() {
        this.userBounded = container.resolve<UserBounded>('UserBounded');
    }
    async getById(patientId: string): Promise<Patient | null> {
        const patient = await Patient.findOne({ where: { id: patientId, organizationId: this.userBounded.orgId } });
        return patient;
    }
    async getByEmail(email: string): Promise<Patient | null> {
        const patient = await Patient.findOne({ where: { email, organizationId: this.userBounded.orgId } });
        return patient;
    }
    async getAll(): Promise<Patient[] | null> {
        const patients = await Patient.findAll({ where: { organizationId: this.userBounded.orgId } });
        return patients;
    }
    async create(patient: Patient): Promise<void> {
        const created = await Patient.create({ ...patient, organizationId: this.userBounded.orgId });
        await PatientMedicalFile.create({ patientId: created.id });
    }
    async update(patientId: string, patient: Patient): Promise<void> {
        await Patient.update(patient, { where: { id: patientId } });
    }
}
export default PatientService;
