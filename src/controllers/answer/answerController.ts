import { updateAnswer } from '../../Infrastructure/schemas/answer/updateAnswer';
import { IHelpFunctions } from '../utils/helpFunctions';

import { IAnswerService } from '../../domains/identity/services/answerService';
import { Controller, Get, Post, Put } from '@overnightjs/core';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ValidateBody } from '../../Infrastructure/decorators/validations';
import { inject, injectable } from 'tsyringe';
import { MustAuth } from '../../Infrastructure/decorators/jwt';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { IUserService } from '../../domains/identity/services/userService';
import { createAnswer } from 'src/Infrastructure/schemas/answer/createAnswer';

@injectable()
@Controller('api/answer')
@MustAuth()
export class AnswerController {
    constructor(@inject('IAnswerService') private answerService: IAnswerService) {}

    @Get(':id')
    private async get(req: ISecureRequest, res: Response) {
        try {
            console.log(req.params);
            const answer = await this.answerService.getById(req.params.id);
            //here get answer and send to response
            return res.status(OK).send(answer);
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
    @Post('')
    @ValidateBody(createAnswer)
    private async create(req: ISecureRequest, res: Response) {
        try {
            //here create answer and send to response
            await this.answerService.create(req.body);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }

    @Put('')
    @ValidateBody(updateAnswer)
    private async update(req: ISecureRequest, res: Response) {
        try {
            //here update answer and send to response
            await this.answerService.update(req.body.id, req.body.data);
            return res.status(OK).send('SUCCESS');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
