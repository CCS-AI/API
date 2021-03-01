import { JwtManager } from '@overnightjs/jwt';

const { APP_REFRESH_TOKEN_SECRET_KEY, APP_REFRESH_TOKEN__SECRET_KEY_EXPIRES_HOURS } = process.env;
const secretKey = APP_REFRESH_TOKEN_SECRET_KEY || 'APP_REFRESH_TOKEN_SECRET_KEY';
const secretKeyExpires = APP_REFRESH_TOKEN__SECRET_KEY_EXPIRES_HOURS || '72';

export const jwtRefreshToken = new JwtManager(secretKey, secretKeyExpires + 'h');
