import { OK } from 'http-status-codes';
import { ISecureRequest } from '@overnightjs/jwt';
import { Controller, Post } from '@overnightjs/core';
import { injectable } from 'tsyringe';
import routeErrorHandling from '../../Infrastructure/exceptions/routeErrorHandling';
import { Response } from 'express';
import WordExtractor from 'word-extractor';

@injectable()
@Controller('api/docx')
export class DocxController {
    @Post('')
    private async upload(req: ISecureRequest, res: Response) {
        try {
            //(^(\d:(.*)){1}(\n\(\d\)(.*))+)
            const extractor = new WordExtractor();
            const extracted = await extractor.extract('test.docx');
            res.status(OK).send('OK');
        } catch (error) {
            routeErrorHandling(error, req, res);
        }
    }
}
