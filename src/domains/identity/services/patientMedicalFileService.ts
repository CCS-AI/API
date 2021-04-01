import { container } from 'tsyringe';
import { User } from '../models/user/user';
import { filterType, rangeType, sortType } from '../../../controllers/admin/utils/index';
import { Patient, PatientMedicalFile } from '../models';
import UserBounded from '../models/user/userBounded';

export interface IPatientMedicalFileService {
    getById(pmfId: string): Promise<PatientMedicalFile | null>;
    getByEmail(email: string): Promise<PatientMedicalFile | null>;
    getAll(): Promise<PatientMedicalFile[] | null>;
    create(pmf: PatientMedicalFile): Promise<void>;
    update(pmfId: string, pmf: PatientMedicalFile): Promise<void>;
}

class PatientMedicalFileService implements IPatientMedicalFileService {
    private userBounded: UserBounded;
    constructor() {
        this.userBounded = container.resolve<UserBounded>('UserBounded');
    }
    async getById(pmfId: string): Promise<PatientMedicalFile | null> {
        const pmf = await PatientMedicalFile.findOne({
            where: { id: pmfId },
            include: [
                {
                    ...this.patientOrgInclude()
                }
            ]
        });
        return pmf;
    }
    async getByEmail(email: string): Promise<PatientMedicalFile | null> {
        const pmf = await PatientMedicalFile.findOne({
            where: { email },
            include: [
                {
                    ...this.patientOrgInclude()
                }
            ]
        });
        return pmf;
    }
    async getAll(): Promise<PatientMedicalFile[] | null> {
        const pmfs = await PatientMedicalFile.findAll({
            include: [
                {
                    ...this.patientOrgInclude()
                }
            ]
        });
        return pmfs;
    }
    async create(pmf: PatientMedicalFile): Promise<void> {
        await PatientMedicalFile.create(pmf);
    }
    async update(pmfId: string, pmf: PatientMedicalFile): Promise<void> {
        await PatientMedicalFile.update(pmf, { where: { id: pmfId } });
    }
    private patientOrgInclude() {
        return {
            attributes: ['id'],
            model: Patient,
            as: 'patient',
            required: true,
            where: {
                organizationId: this.userBounded.orgId
            }
        };
    }
}
export default PatientMedicalFileService;
