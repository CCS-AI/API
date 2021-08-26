import { container } from 'tsyringe';
import UserBounded from 'src/domains/identity/models/user/userBounded';

export interface IHelpFunctions {
    checkPremission(role: string, action: string): Promise<boolean>;
}

class HelpFunctions implements IHelpFunctions {
    async checkPremission(role: string, action: string): Promise<boolean> {
        switch (action) {
            case 'createPatient':
            case 'createExamination':
            case 'patients':
            case 'error':
            case 'home':
            case 'login': {
                if (['ADMIN', 'EXAMINER', 'ORGANIZATION_MANAGER'].includes(role)) {
                    return true;
                }
                break;
            }
            case 'registerExaminer': {
                if (['ADMIN', 'ORGANIZATION_MANAGER'].includes(role)) {
                    return true;
                }
                break;
            }
        }
        return false;
    }
}
export default HelpFunctions;
