import * as nodemailer from 'nodemailer';

export interface IEmailService {
    sendEmail(options: nodemailer.SendMailOptions): Promise<void>;
}
