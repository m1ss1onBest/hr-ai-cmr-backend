import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IMailService } from 'src/shared/contracts/mail/mail.interface';
import { MailConfig } from './mail.config';

@Injectable()
export class MailService implements IMailService, OnModuleInit {
  private readonly logger: Logger = new Logger(MailService.name);

  constructor(
    private readonly mailConfig: MailConfig,
    private readonly mailer: MailerService,
  ) {}

  onModuleInit() {
    const l = () => {
      this.logger.log('Mail module loaded successfully');
    };
    if (!this.mailConfig.isEnabled) {
      l();
      this.logger.warn(`Mail disabled.`);
      return;
    }

    l();
    this.logger.log(`Mail enabled`);
  }

  async sendVerifyEmail(email: string, token: string): Promise<void> {
    // If SMTP isn't configured, don't block flows like registration in local/dev.
    if (!this.mailConfig.isEnabled) {
      // In local/dev SMTP is often disabled. Print the link so it can be tested manually.
      const base =
        process.env.EMAIL_VERIFICATION_URL ??
        this.mailConfig.EMAIL_VERIFICATION_URL;
      const verifyUrl = base
        ? `${base}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
        : `token=${token} email=${email}`;
      console.log(
        `[MailService] Mail disabled. Verification link: ${verifyUrl}`,
      );
      return;
    }

    const link = this.mailConfig.EMAIL_VERIFICATION_URL;
    const verifyUrl = `${link}?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    await this.mailer.sendMail({
      to: email,
      subject: 'Verify your email address',
      template: 'verify-email',
      context: {
        verifyUrl,
        token,
      },
    });
  }

  async sendForgotPassword(email: string, token: string) {
    if (!this.mailConfig.isEnabled) return;

    const link = this.mailConfig.EMAIL_FORGOT_PASSWORD_URL;

    await this.mailer.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'forgot-password',
      context: { forgotPasswordUrl: `${link}?token=${token}` },
    });
  }
}
