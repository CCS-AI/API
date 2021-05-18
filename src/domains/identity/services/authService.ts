import { jwtManager } from '../../../Infrastructure/middlewares/jwtMiddleware';
import { jwtRefreshToken } from '../../../Infrastructure/middlewares/jwtRefreshToken';
import { User } from '../models';

// const { APP_SECRET_KEY_EXPIRES_HOURS } = process.env;
// const secretKeyExpires = APP_SECRET_KEY_EXPIRES_HOURS || "10";

export interface IAuthService {
    generateToken(user: User): Promise<{ token: string; refreshToken: string }>;
}

class AuthService implements IAuthService {
    public async generateToken(user: User): Promise<{ token: string; refreshToken: string }> {
        const token = jwtManager.jwt({
            userId: user.Id,
            userName: user.FullName,
            userPicture: user.profileImg,
            email: user.Email,
            organizationId: user.organizationId,
            role: user.role
        });

        const refreshToken = jwtRefreshToken.jwt({ userId: user.Id });

        return { token, refreshToken };
    }
}

export default AuthService;
