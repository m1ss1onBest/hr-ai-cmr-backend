import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMailService } from 'src/shared/contracts/mail/mail.interface';
import { MailConfig } from './config';

@Injectable()
export class MailService implements IMailService {
  constructor(
    private readonly mailConfig: MailConfig,
    private readonly mailer: MailerService,
  ) {}

  async sendVerifyEmail(email: string): Promise<void> {
    // If SMTP isn't configured, don't block flows like registration in local/dev.
    if (!this.mailConfig.isEnabled) return;

    const link = this.mailConfig.EMAIL_VERIFICATION_URL;

    await this.mailer.sendMail({
      to: email,
      subject: 'Verify your email address',
      template: 'verify-email',
      context: {
        verifyUrl: link,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendForgotPassword(email: string) {
    throw new Error('Method not implemented.');
  }
}
