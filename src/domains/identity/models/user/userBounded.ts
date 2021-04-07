import { User } from './user';
export default class UserBounded {
    private organizationId: string;

    get orgId(): string {
        return this.organizationId;
    }

    set orgId(organizationId: string) {
        this.organizationId = organizationId;
    }
}
