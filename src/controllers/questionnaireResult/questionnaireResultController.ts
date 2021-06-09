import { updateQuestionnaireResult } from './../../Infrastructure/schemas/questionnaireResult/updateQuestionnaireResult';
import { createQuestionnaireResult } from './../../Infrastructure/schemas/questionnaireResult/createQuestionnaireResult';
import { IQuestionnaireResultService } from './../../domains/identity/services/questionnaireResultService';

import { IHelpFunctions } from '../utils/helpFunctions';


import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { IUserService } from '../../domains/identity/services/userService';
// import { createQuestionnaireResult } from 'src/Infrastructure/schemas/questionnaireResult/createQuestionnaireResult';


@injectable()
@Controller('api/questionnaireResult')
@MustAuth()
export class QuestionnaireResultController {
    constructor(@inject('IQuestionnaireResultService') private questionnaireResultService: IQuestionnaireResultService) {}

    @Get(':id')
    private async get(req: ISecureRequest, res: Response) {
        try {
            console.log(req.params);
            const questionnaireResult = await this.questionnaireResultService.getById(req.params.id);
            //here get questionnaireResult and send to response
            return res.status(OK).send(questionnaireResult);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('')
    @ValidateBody(createQuestionnaireResult)
    private async create(req: ISecureRequest, res: Response) {
        try {
            //here create questionnaireResult and send to response
            await this.questionnaireResultService.create(req.body);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Put('')
    @ValidateBody(updateQuestionnaireResult)
    private async update(req: ISecureRequest, res: Response) {
        try {
            //here update questionnaireResult and send to response
            await this.questionnaireResultService.update(req.body.id, req.body.data);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
