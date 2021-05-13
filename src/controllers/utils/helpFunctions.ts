import { container } from 'tsyringe';
import UserBounded from 'src/domains/identity/models/user/userBounded';

export interface IhelpFunctions {
    checkPremission(role: string, action: string): Promise<boolean>;
}

class HelpFunctions implements IhelpFunctions {
    private helpFunctions: IhelpFunctions;
    constructor() {
        this.helpFunctions = container.resolve<IhelpFunctions>('IhelpFunctions');
    }
    async checkPremission(role: string, action: string): Promise<boolean> {
        switch (action) {
            case 'createPatient' || 'createExamination' || 'patients' || 'error' || 'home' || 'login': {
                if (role == ('ADMIN' || 'EXAMINER' || 'ORGANIZATION_MANAGER')) {
                    return true;
                }
                break;
            }
            case 'registerExaminer': {
                if (role == ('ADMIN' || 'ORGANIZATION_MANAGER')) {
                    return true;
                }
                break;
            }
        }
        return false;
    }
}
export default HelpFunctions;
