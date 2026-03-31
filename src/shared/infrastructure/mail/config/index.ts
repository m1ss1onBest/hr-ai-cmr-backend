import { IsNotEmpty, IsString } from 'class-validator';
import { Config } from '../../config';

@Config()
export class MailConfig {
  @IsString()
  @IsNotEmpty()
  public readonly SMTP_FROM: string = process.env.SMTP_FROM ?? '';

  @IsString()
  @IsNotEmpty()
  public readonly SMTP_HOST: string = process.env.SMTP_HOST ?? '';

  @IsString()
  @IsNotEmpty()
  public readonly SMTP_PASS: string = process.env.SMTP_PASS ?? '';

  @IsString()
  @IsNotEmpty()
  public readonly SMTP_PORT: string = process.env.SMTP_PORT ?? '';

  @IsString()
  @IsNotEmpty()
  public readonly SMTP_USER: string = process.env.SMTP_USER ?? '';

  @IsString()
  @IsNotEmpty()
  public readonly EMAIL_VERIFICATION_URL: string =
    process.env.EMAIL_VERIFICATION_URL ?? '';

  // SMTP_FORGOT_PASSWORD_URL=
}
