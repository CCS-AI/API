import { IPatientService } from './../../domains/identity/services/patientService';
import { updatePatient } from './../../Infrastructure/schemas/patient/updatePatient';
import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK } from 'http-status-codes';
import { ValidateBody } from 'src/Infrastructure/decorators/validations';
import { createPatient } from 'src/Infrastructure/schemas/patient/createPatient';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { UserBounded } from '../../Infrastructure/decorators/userBounded';

@injectable()
@Controller('api/patient')
@MustAuth()
@UserBounded()
export class PatientController {
    constructor(@inject('IPatientService') private patientService: IPatientService) {}
    @Get('all')
    private async getAll(req: ISecureRequest, res: Response) {
        try {
            //here getAll patient and send to response
            const patients = await this.patientService.getAll();
            return res.status(OK).send(patients);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Get(':patientId')
    private async get(req: ISecureRequest, res: Response) {
        try {
            const patient = await this.patientService.getById(req.params.patientId);
            //here get patient and send to response
            return res.status(OK).send(patient);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('')
    @ValidateBody(createPatient)
    private async create(req: ISecureRequest, res: Response) {
        try {
            //here create patient and send to response
            await this.patientService.create(req.body);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Put('')
    @ValidateBody(updatePatient)
    private async update(req: ISecureRequest, res: Response) {
        try {
            //here update patient and send to response
            await this.patientService.update(req.body.id, req.body.data);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
