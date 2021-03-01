import { Controller, Get, Post } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Logger as consoleLog } from '@overnightjs/logger';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { inject, injectable, container } from 'tsyringe';
import { User } from '../../domains/identity/models';
import { IUserService } from '../../domains/identity/services/userService';
import { RouteMustAuth } from '../../Infrastructure/decorators/jwt';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { ILogger } from '../../Infrastructure/logging/ILogger';

@injectable()
@Controller('api/user')
export class UserController {
    constructor(
        @inject('IUserService') private userService: IUserService,
        @inject('ILogger') private logger: ILogger,
    ) {}

    @Get('getByEmail/:email')
    private async get(req: Request, res: Response) {
        try {
            if (!req.params.email) return res.status(BAD_REQUEST).json('INVALID_EMAIL');

            const user = await this.userService.getByEmail(req.params.email);

            return res.status(OK).json(user);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Get('')
    @RouteMustAuth()
    private async getUser(req: ISecureRequest, res: Response) {
        try {
            consoleLog.Info(req.payload, true);

            const { userId } = req.payload;
            const user = await this.userService.getById(userId);

            if (!user) {
                return res.status(NOT_FOUND).send('USER_NOT_FOUND');
            }

            return res.status(OK).json({
                id: user.Id,
                email: user.Email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                birthDate: user.birthDate,
                phoneNumber: user.phoneNumber,
                profileImg: user.profileImg,
            });
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Get(':userId')
    @RouteMustAuth()
    private async getById(req: ISecureRequest, res: Response) {
        try {
            const { userId } = req.params;
            const user = await this.userService.getUserDetailsById(userId);

            if (!user) {
                return res.status(NOT_FOUND).send('USER_NOT_FOUND');
            }

            return res.status(OK).json(user);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Get('getAll')
    @RouteMustAuth()
    private async getAll(req: ISecureRequest, res: Response) {
        try {
            consoleLog.Info(req.payload, true);
            const users = await this.userService.getAll();

            return res.status(OK).json(users);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
