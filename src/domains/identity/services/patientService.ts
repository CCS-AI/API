import { container, inject } from 'tsyringe';
import { Patient, PatientMedicalFile } from '../models';
import UserBounded from '../models/user/userBounded';
import { IPatientMedicalFileService } from './patientMedicalFileService';
import { baseFilterType as filterType, IPatientFilterService } from './patientFilterService';

export interface IPatientService {
    getById(patientId: string): Promise<Patient | null>;
    getByEmail(email: string): Promise<Patient | null>;
    getAll(filter: filterType): Promise<Patient[]>;
    create(patient: Patient): Promise<void>;
    update(patientId: string, patient: Patient): Promise<void>;
    getByPmfId(pmfid: string): Promise<Patient | null>;
}

//@injectable()
class PatientService implements IPatientService {
    private userBounded: UserBounded;
    private PatientMedicalFileService: IPatientMedicalFileService;
    private patientFilterService: IPatientFilterService;
    constructor() {
        this.PatientMedicalFileService = container.resolve<IPatientMedicalFileService>('IPatientMedicalFileService');
        this.patientFilterService = container.resolve<IPatientFilterService>('IPatientFilterService');
        this.userBounded = container.resolve<UserBounded>('UserBounded');
    }
    async getById(patientId: string): Promise<Patient | null> {
        const patient = await Patient.findOne({ where: { id: patientId, organizationId: this.userBounded.orgId } });
        return patient;
    }
    async getByPmfId(pmfid: string): Promise<Patient | null> {
        const pmf = await this.PatientMedicalFileService.getById(pmfid);
        const patientId = pmf?.patientId;
        const patient = await Patient.findOne({ where: { id: patientId } });
        return patient;
    }
    async getByEmail(email: string): Promise<Patient | null> {
        const patient = await Patient.findOne({ where: { email, organizationId: this.userBounded.orgId } });
        return patient;
    }
    async getAll(filter: filterType): Promise<Patient[]> {
        return await this.patientFilterService.getPatientsByFilter({ ...filter, organizationId: this.userBounded.orgId });
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
