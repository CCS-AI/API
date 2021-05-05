import { createPmf } from './../../Infrastructure/schemas/patientMedicalFile/createPmf';
import { updatePmf } from './../../Infrastructure/schemas/patientMedicalFile/updatePmf';
import { IPatientMedicalFileService } from './../../domains/identity/services/patientMedicalFileService';
import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { ValidateBody } from './../../Infrastructure/decorators/validations';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { UserBounded } from '../../Infrastructure/decorators/userBounded';

@injectable()
@Controller('api/patientMedicalFile')
@MustAuth()
@UserBounded()
export class PatientMedicalFileController {
    constructor(@inject('IPatientMedicalFileService') private pmfService: IPatientMedicalFileService) {}
    @Get('all')
    private async getAll(req: ISecureRequest, res: Response) {
        try {
            //here getAll patient and send to response
            const patients = await this.pmfService.getAll();
            return res.status(OK).send(patients);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Get(':patientId')
    private async get(req: ISecureRequest, res: Response) {
        try {
            const pmf = await this.pmfService.getByPatientId(req.params.patientId);
            //here get patient and send to response
            return res.status(OK).send(pmf);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('')
    @ValidateBody(createPmf)
    private async create(req: ISecureRequest, res: Response) {
        try {
            //here create patient and send to response
            await this.pmfService.create(req.body);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Put('')
    @ValidateBody(updatePmf)
    private async update(req: ISecureRequest, res: Response) {
        try {
            //here update patient and send to response
            await this.pmfService.update(req.body.id, req.body.data);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
