import { Controller, Get, Post } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { compare } from 'bcrypt';
import { CookieOptions, Request, Response } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { inject, injectable } from 'tsyringe';
import { promisify } from 'util';
import { User } from '../../domains/identity/models';
import { IAuthService } from '../../domains/identity/services/authService';
import { IUserService } from '../../domains/identity/services/userService';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import { IEmailService } from '../../Infrastructure/emailService/IEmailService';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { ILogger } from '../../Infrastructure/logging/ILogger';
import { credentialsSchema } from '../../Infrastructure/schemas/auth/credentials';

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

    @Post('')
    @ValidateBody(credentialsSchema)
    private async getToken(req: Request, res: Response) {
        try {
            const { email, password, recaptchaToken } = req.body;

            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
            const verifyResult = await fetch(verifyUrl, { method: 'POST' });
            const verifyData = await verifyResult.json();

            if (verifyData.score < 0.5) return res.status(BAD_REQUEST).send('BAD REQUEST');

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

            var expiresDate = new Date();
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

            var expiresDate = new Date();
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


    @Get('isResetPasswordTokenValid/:token')
    private async isResetPasswordTokenValid(req: Request, res: Response) {
        try {
            let isValid = false;

            const token = req.params.token;

            const payload = jwt.decode(token);

            if (!(<any>payload)?.userId) return res.status(OK).json(isValid);
            const { userId } = <any>payload;

            const user = await this.userService.getById(userId);
            if (!user) return res.status(OK).json(isValid);

            try {
                await (<any>promisify(jwt.verify))(token, user.Password);
                isValid = true;
            } catch {
                isValid = false;
            }

            return res.status(OK).json(isValid);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    // @Post('resetPassword/:token')
    // @ValidateBody(resetPasswordSchema)
    // private async resetPassword(req: Request, res: Response) {
    //     try {
    //         const token = req.params.token;
    //         const { password, passwordConfirm } = req.body;

    //         const payload = jwt.decode(token);

    //         const { userId } = <any>payload;

    //         const user = await User.findOne({ where: { id: userId } });
    //         if (!user) return res.status(UNAUTHORIZED).send('Token is invalid or has expired');

    //         await (<any>promisify(jwt.verify))(token, user.Password);

    //         if (password !== passwordConfirm) return res.status(BAD_REQUEST).send('Passwords are not match');

    //         // await this.userService.updatePassword(user, password);

    //         return res.status(OK).json('User password has been updated');
    //     } catch (error) {
    //         routeErrorHandling(error, req, res);
    //     }
    // }
}

export { AuthController };
