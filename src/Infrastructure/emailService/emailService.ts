import * as nodemailer from 'nodemailer';
import { singleton } from 'tsyringe';
import { IEmailService } from './IEmailService';

@singleton()
class EmailService implements IEmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: <string>process.env.SMTP_HOST,
            port: parseInt(<string>process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_LOGIN,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    public async sendEmail(options: nodemailer.SendMailOptions): Promise<void> {
        const mailOptions = {
            from: `<no-reply@ccs.ai>`,
            ...options
        };

        await this.transporter.sendMail(mailOptions);
    }
}
export default EmailService;
