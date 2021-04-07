import { registerSchema } from './../../Infrastructure/schemas/auth/register';
import { Controller, Get, Post } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { compare } from 'bcrypt';
import { CookieOptions, Request, Response } from 'express';
import { OK, UNAUTHORIZED } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { User } from '../../domains/identity/models';
import { IAuthService } from '../../domains/identity/services/authService';
import { IUserService } from '../../domains/identity/services/userService';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import { IEmailService } from '../../Infrastructure/emailService/IEmailService';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { ILogger } from '../../Infrastructure/logging/ILogger';
import { credentialsSchema } from '../../Infrastructure/schemas/auth/credentials';
import { RouteMustAuth } from './../../Infrastructure/decorators/jwt';

@injectable()
@Controller('api/auth')
class AuthController {
    private cookieOptions: CookieOptions = { httpOnly: true, sameSite: 'lax', secure: true };

    constructor(
        @inject('IAuthService') private authService: IAuthService,
        @inject('IUserService') private userService: IUserService,
        @inject('IEmailService') private emailService: IEmailService,
        @inject('ILogger') private logger: ILogger
    ) {
        const env = process.env.NODE_ENV || 'development';
        if (env === 'development') this.cookieOptions = { httpOnly: true, sameSite: 'lax' };
    }

    @Post('register')
    @RouteMustAuth()
    @ValidateBody(registerSchema)
    private async register(req: ISecureRequest, res: Response) {
        try {
            const { email, password, firstName, lastName, birthDate, profileImg, role } = req.body;

            const { organizationId } = req.payload;

            const user: User | null = await this.userService.getByEmail(email.trim().toLowerCase());
            if (user) return res.status(UNAUTHORIZED).send('EMAIL_ALREADY_EXISTS');

            await this.userService.createUser(User.build({ email, password, firstName, lastName, birthDate, profileImg, role, organizationId }));
            return res.status(OK).send('REGISTERED_SUCCESFULLY');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Post('')
    @ValidateBody(credentialsSchema)
    private async getToken(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user: User | null = await this.userService.getByEmail(email.trim().toLowerCase());
            if (!user) return res.status(UNAUTHORIZED).send('Incorrect email or password');

            const match = await compare(password.toString(), user.Password);
            if (!match) return res.status(UNAUTHORIZED).send('Incorrect email or password');

            if (user.shouldResetPassword) {
                const shouldResetPasswordToken = jwt.sign(
                    {
                        userId: user.Id
                    },
                    user.Password,
                    {
                        expiresIn: '1h'
                    }
                );

                return res.status(OK).json({ shouldResetPasswordToken });
            }
            const token = await this.authService.generateToken(user);

            const expiresDate = new Date();
            expiresDate.setDate(expiresDate.getDate() + 2);

            this.cookieOptions.expires = expiresDate;

            res.cookie('ccsToken', token.refreshToken, this.cookieOptions);

            return res.status(OK).json(token);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Get('refreshToken')
    private async refreshToken(req: ISecureRequest, res: Response) {
        try {
            const refreshToken = req.cookies.ccsToken;

            if (!refreshToken) return res.status(UNAUTHORIZED).send('NO_REFRESH_TOKEN');

            const payload = jwt.decode(refreshToken);

            const { userId } = <any>payload;

            const user: User | null = await this.userService.getById(userId);
            if (!user) return res.status(UNAUTHORIZED).send('RefreshToken - User not found or inactive');

            const token = await this.authService.generateToken(user);

            const expiresDate = new Date();
            expiresDate.setDate(expiresDate.getDate() + 2);

            this.cookieOptions.expires = expiresDate;

            res.cookie('ccsToken', token.refreshToken, this.cookieOptions);

            return res.status(OK).json(token);
        } catch (error) {
            // routeErrorHandling(error, req, res);

            this.logger.error({
                url: req.originalUrl,
                action: req.method,
                error: error
            });

            return res.status(OK).json({
                errorMessage: error.message
            });
        }
    }

    @Post('logout')
    private async logout(req: ISecureRequest, res: Response) {
        res.clearCookie('ccsToken', this.cookieOptions);

        return res.status(OK).json('');
    }
}

export { AuthController };
