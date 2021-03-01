import { JwtManager } from '@overnightjs/jwt';

const { APP_SECRET_KEY, APP_SECRET_KEY_EXPIRES_HOURS } = process.env;
const secretKey = APP_SECRET_KEY || 'secret';
const secretKeyExpires = APP_SECRET_KEY_EXPIRES_HOURS || '10';

export const jwtManager = new JwtManager(secretKey, secretKeyExpires + 'h');
