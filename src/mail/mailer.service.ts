import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // service: 'gmail',
      host: 'smtp.mailgun.org',
      port: 465, // or 465 for SMTPS
      secure: true, // true for SMTPS
      auth: {
        // user: process.env.EMAIL_USERNAME,
        user: 'postmaster@sandbox0210339e77814fec81fe3bfa0b9e886a.mailgun.org',
        // pass: process.env.EMAIL_PASSWORD,
        pass: 'e234e6b6d1d8092d44cd095cf7d25267-53ce4923-5f144029',
      },
    });
  }

  async sendMail(options: nodemailer.SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: 'paceroot0@gmail.com',
      ...options,
    });
  }
}
