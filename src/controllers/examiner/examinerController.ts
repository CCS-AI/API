import { IHelpFunctions } from './../utils/helpFunctions';
import { IExaminerService } from './../../domains/identity/services/examinerService';
import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { User } from './../../domains/identity/models';
import { registerSchema } from '../../Infrastructure/schemas/examiner/createExaminer';
import { IUserService } from './../../domains/identity/services/userService';

@injectable()
@Controller('api/examiner')
@MustAuth()
export class ExaminerController {
    constructor(
        @inject('IExaminerService') private examinerService: IExaminerService,
        @inject('IUserService') private userService: IUserService,
        @inject('IHelpFunctions') private helpFunctions: IHelpFunctions
    ) {}
    @Get('all')
    private async getAll(req: ISecureRequest, res: Response) {
        try {
            //here getAll examiner and send to response
            const examiners = await this.examinerService.getAll();
            return res.status(OK).send(examiners);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Get(':examinerId')
    private async get(req: ISecureRequest, res: Response) {
        try {
            console.log(req.params);
            const examiner = await this.examinerService.getById(req.params.examinerId);
            //here get examiner and send to response
            return res.status(OK).send(examiner);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    // @Post('')
    // @ValidateBody(createExaminer)
    // private async create(req: ISecureRequest, res: Response) {
    //     try {
    //     //    //here create examiner and send to response
    //         const { organizationId } = req.payload;
    //         await this.examinerService.create({ ...req.body, organizationId });
    //         return res.status(OK).send('SUCCESS');
    //     } catch (error) {
    //         routeErrorHandling(error, req, res);
    //     }
    // }
    @Post('register')
    @ValidateBody(registerSchema)
    private async register(req: ISecureRequest, res: Response) {
        try {
            if (await this.helpFunctions.checkPremission(req.payload.role, 'registerExaminer')) {
                const { email, password, firstName, lastName, birthDate, profileImg, licenseNumber } = req.body;
                const { organizationId } = req.payload;
                const user: User | null = await this.userService.getByEmail(email.trim().toLowerCase());

                if (user) return res.status(UNAUTHORIZED).send('EMAIL_ALREADY_EXISTS');
                await this.examinerService.register(
                    User.build({ email, password, firstName, lastName, birthDate, profileImg, role: 'EXAMINER', organizationId }),
                    licenseNumber
                );
                return res.status(OK).send('SUCCESS');
            } else {
                return res.status(INTERNAL_SERVER_ERROR).send('You do not have permission to regiser a examiner');
            }
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    // @Put('')
    // @ValidateBody(updateExaminer)
    // private async update(req: ISecureRequest, res: Response) {
    //     try {
    //         //here update examiner and send to response
    //         await this.examinerService.update(req.body.id, req.body.data);
    //         return res.status(OK).send('SUCCESS');
    //     } catch (error) {
    //         routeErrorHandling(error, req, res);
    //     }
    // }
}
