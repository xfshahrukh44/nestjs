import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    async sendEmail(to: string, subject: string, text: string): Promise<any> {
        // Configure the SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true, // Set to true if using SSL/TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        });

        // Prepare the email message
        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: to,
            subject: subject,
            html: text,
        };

        try {
            // Send the email
            let res = await transporter.sendMail(mailOptions);
            console.log('res', res);
            // console.log('Email sent successfully');
            // return 'Email sent successfully';
            return true;
        } catch (error) {
            // console.error('Error sending email:', error);
            console.log('error', error);
            // return 'Error sending email:';
            return false;
        }
    }
}
