import { updateQuestionnaire } from '../../Infrastructure/schemas/questionnaire/updateQuestionnaire';
import { createQuestionnaire } from '../../Infrastructure/schemas/questionnaire/createQuestionnaire';
import { IQuestionnaireService } from '../../domains/identity/services/questionnaireService';
import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';

@injectable()
@Controller('api/questionnaire')
@MustAuth()
export class QuestionnaireController {
    constructor(@inject('IQuestionnaireService') private questionnaireService: IQuestionnaireService) {}

    @Get('all')
    private async getAll(req: ISecureRequest, res: Response) {
        try {
            //here getAll patient and send to response
            const patients = await this.questionnaireService.getAll();
            return res.status(OK).send(patients);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Get(':id')
    private async get(req: ISecureRequest, res: Response) {
        try {
            const questionnaire = await this.questionnaireService.getById(req.params.id);
            //here get questionnaire and send to response
            return res.status(OK).send(questionnaire);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('')
    @ValidateBody(createQuestionnaire)
    private async create(req: ISecureRequest, res: Response) {
        try {
            //here create questionnaire and send to response
            await this.questionnaireService.create(req.body);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Put('')
    @ValidateBody(updateQuestionnaire)
    private async update(req: ISecureRequest, res: Response) {
        try {
            //here update questionnaire and send to response
            await this.questionnaireService.update(req.body.id, req.body.data);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
