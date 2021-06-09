import { OK, BAD_REQUEST } from 'http-status-codes';
import { ISecureRequest } from '@overnightjs/jwt';
import { Controller, Post } from '@overnightjs/core';
import { inject, injectable } from 'tsyringe';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { Response } from 'express';
import WordExtractor from 'word-extractor';
import Database from '../../Infrastructure/db/sequelize';
import { Answer, Question, Questionnaire } from '../../domains/identity/models';

@injectable()
@Controller('api/docx')
export class DocxController {
    constructor(@inject('database') private db: Database) {}
    @Post('')
    private async uploadQuestionnaire(req: ISecureRequest, res: Response) {
        try {
            console.log('DocxController : req.files', req.files);
            if (!req.files || req.files.length === 0) res.status(BAD_REQUEST).send('Must upload questionnaire file');
            const files: any = req.files;
            await Promise.all(
                files.map(async (file: any) => {
                    const extractor = new WordExtractor();
                    const extracted = await extractor.extract(file.buffer);
                    const body = extracted.getBody();
                    const filename = file.fieldname || file.originalname;
                    if (body) {
                        const transaction = await this.db.sequelize.transaction();
                        try {
                            const questionnaire = await Questionnaire.create({ name: filename }, { transaction });
                            const firstRegex = /\d+?: (.+?)\s((?:\(\d+?\) .+[\s])+)/g;
                            const secondRegex = /(?<=\(\d+?\) ).+(?=\s|$)/g;
                            let match;
                            while ((match = firstRegex.exec(body)) !== null) {
                                const questionStr = match[1];
                                const question = await Question.create({ name: questionStr, questionnaireId: questionnaire.id }, { transaction });
                                const answers = match[2].match(secondRegex);
                                if (answers && answers.length)
                                    await Answer.bulkCreate(
                                        answers.map((item) => {
                                            return { name: item, questionId: question.id };
                                        }),
                                        { transaction }
                                    );
                            }
                            await transaction.commit();
                        } catch (e) {
                            console.log('DocxController : e', e);
                            await transaction.rollback();
                        }
                    }
                    return Promise.resolve('done');
                })
            );

            res.status(OK).send('OK');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
