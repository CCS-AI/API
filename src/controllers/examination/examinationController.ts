import { createExamination } from 'src/Infrastructure/schemas/examination/createExamination';
import { IExaminationService } from './../../domains/identity/services/examinationService';
import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK, UNAUTHORIZED } from 'http-status-codes';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { IUserService } from './../../domains/identity/services/userService';
import { updateExamination } from 'src/Infrastructure/schemas/examination/updateExamination';

@injectable()
@Controller('api/examination')
@MustAuth()
export class ExaminationController {
    constructor(
        @inject('IExaminationService') private examinationService: IExaminationService,
        @inject('IUserService') private userService: IUserService
    ) {}
    @Get('pmf/:pmfId')
    private async getAllByPmf(req: ISecureRequest, res: Response) {
        try {
            //here getAllByPmfid examination and send to response
            const examinations = await this.examinationService.getAllByPmf(req.params.pmfId);
            return res.status(OK).send(examinations);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Get(':id')
    private async get(req: ISecureRequest, res: Response) {
        try {
            console.log(req.params);
            const examination = await this.examinationService.getById(req.params.id);
            //here get examination and send to response
            return res.status(OK).send(examination);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('')
    @ValidateBody(createExamination)
    private async create(req: ISecureRequest, res: Response) {
        try {
            //here create examination and send to response
            await this.examinationService.create(req.body);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Put('')
    @ValidateBody(updateExamination)
    private async update(req: ISecureRequest, res: Response) {
        try {
            //here update examination and send to response
            await this.examinationService.update(req.body.id, req.body.data);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
