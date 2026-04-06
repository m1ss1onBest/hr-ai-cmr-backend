import { Module } from '@nestjs/common';
import { MailConfig } from './config';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

import { join } from 'path';

export const MAIL_MODULE_PROVIDERS = [MailService];

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [MailConfig],
      useFactory: (config: MailConfig) => {
        // Mail disabled (e.g. local dev without SMTP). Keep module initialized.
        if (!config.isEnabled) {
          return {
            transport: {
              jsonTransport: true,
            },
          };
        }

        return {
          transport: {
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: false,
            auth: {
              user: config.SMTP_USER,
              pass: config.SMTP_PASS,
            },
          },
          defaults: {
            from: config.SMTP_FROM,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [...MAIL_MODULE_PROVIDERS],
  exports: [...MAIL_MODULE_PROVIDERS],
})
export class MailModule {}
