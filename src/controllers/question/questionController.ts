import { updateQuestion } from '../../Infrastructure/schemas/question/updateQuestion';
import { IHelpFunctions } from '../utils/helpFunctions';

import { IQuestionService } from '../../domains/identity/services/questionService';
import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { IUserService } from '../../domains/identity/services/userService';
import { createQuestion } from 'src/Infrastructure/schemas/question/createQuestion';


@injectable()
@Controller('api/question')
@MustAuth()
export class QuestionController {
    constructor(@inject('IQuestionService') private questionService: IQuestionService) {}

    @Get(':id')
    private async get(req: ISecureRequest, res: Response) {
        try {
            console.log(req.params);
            const question = await this.questionService.getById(req.params.id);
            //here get question and send to response
            return res.status(OK).send(question);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('')
    @ValidateBody(createQuestion)
    private async create(req: ISecureRequest, res: Response) {
        try {
            //here create question and send to response
            await this.questionService.create(req.body);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Put('')
    @ValidateBody(updateQuestion)
    private async update(req: ISecureRequest, res: Response) {
        try {
            //here update question and send to response
            await this.questionService.update(req.body.id, req.body.data);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
