import { User } from '../models/user/user';
import { filterType, rangeType, sortType } from '../../../controllers/admin/utils/index';
import { PatientMedicalFile } from '../models';

export interface IPatientMedicalFileService {
    getById(pmfId: string): Promise<PatientMedicalFile | null>;
    getByEmail(email: string): Promise<PatientMedicalFile | null>;
    getAll(): Promise<PatientMedicalFile[] | null>;
    create(pmf: PatientMedicalFile): Promise<void>;
    update(pmfId: string, pmf: PatientMedicalFile): Promise<void>;
}

class PatientMedicalFileService implements IPatientMedicalFileService {
    async getById(pmfId: string): Promise<PatientMedicalFile | null> {
        const pmf = await PatientMedicalFile.findOne({ where: { id: pmfId } });
        return pmf;
    }
    async getByEmail(email: string): Promise<PatientMedicalFile | null> {
        const pmf = await PatientMedicalFile.findOne({ where: { email } });
        return pmf;
    }
    async getAll(): Promise<PatientMedicalFile[] | null> {
        const pmfs = await PatientMedicalFile.findAll();
        return pmfs;
    }
    async create(pmf: PatientMedicalFile): Promise<void> {
        await PatientMedicalFile.create(pmf);
    }
    async update(pmfId: string, pmf: PatientMedicalFile): Promise<void> {
        await PatientMedicalFile.update(pmf, { where: { id: pmfId } });
    }
}
export default PatientMedicalFileService;
