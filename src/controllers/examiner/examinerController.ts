import { IExaminerService } from './../../domains/identity/services/examinerService';
import { updateExaminer } from './../../Infrastructure/schemas/examiner/updateExaminer';
import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK, UNAUTHORIZED } from 'http-status-codes';
import { ValidateBody } from 'src/Infrastructure/decorators/validations';
import { createExaminer } from 'src/Infrastructure/schemas/examiner/createExaminer';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { User } from 'src/domains/identity/models';
import { Examiner } from 'src/domains/identity/models/examiner/examiner';

@injectable()
@Controller('api/examiner')
@MustAuth()
export class ExaminerController {
    constructor(@inject('IExaminerService') private examinerService: IExaminerService) {}
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
            const examiner = await this.examinerService.getById(req.params.examinerId);
            //here get examiner and send to response
            return res.status(OK).send(examiner);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('')
    @ValidateBody(createExaminer)
    private async create(req: ISecureRequest, res: Response) {
        try {
            //here create examiner and send to response
            const { organizationId } = req.payload;
            await this.examinerService.create({ ...req.body, organizationId });
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('register')
    @ValidateBody(createExaminer)
    private async register(req: ISecureRequest, res: Response) {
        try {
            const { email, password, firstName, lastName, birthDate, profileImg, role, licenseNumber } = req.body;
            const { organizationId } = req.payload;
            const examiner: Examiner | null = await this.examinerService.getByEmail(email.trim().toLowerCase());

            if (examiner) return res.status(UNAUTHORIZED).send('EMAIL_ALREADY_EXISTS');
            await this.examinerService.register(
                User.build({ email, password, firstName, lastName, birthDate, profileImg, role, organizationId }),
                licenseNumber
            );
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Put('')
    @ValidateBody(updateExaminer)
    private async update(req: ISecureRequest, res: Response) {
        try {
            //here update examiner and send to response
            await this.examinerService.update(req.body.id, req.body.data);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}