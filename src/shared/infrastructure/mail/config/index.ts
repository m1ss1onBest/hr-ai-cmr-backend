import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { Config } from '../../config';

@Config()
export class MailConfig {
  /**
   * If SMTP_HOST is not provided, mail sending is considered disabled.
   * In that case we don't fail app startup on missing mail env vars.
   */
  @IsOptional()
  @IsString()
  public readonly SMTP_HOST?: string = process.env.SMTP_HOST;

  @ValidateIf((o: MailConfig) => !!o.SMTP_HOST)
  @IsString()
  @IsNotEmpty()
  public readonly SMTP_FROM: string = process.env.SMTP_FROM!;

  @ValidateIf((o: MailConfig) => !!o.SMTP_HOST)
  @IsString()
  @IsNotEmpty()
  public readonly SMTP_PASS: string = process.env.SMTP_PASS!;

  @ValidateIf((o: MailConfig) => !!o.SMTP_HOST)
  @IsString()
  @IsNotEmpty()
  public readonly SMTP_PORT: string = process.env.SMTP_PORT!;

  @ValidateIf((o: MailConfig) => !!o.SMTP_HOST)
  @IsString()
  @IsNotEmpty()
  public readonly SMTP_USER: string = process.env.SMTP_USER!;

  @ValidateIf((o: MailConfig) => !!o.SMTP_HOST)
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  public readonly EMAIL_VERIFICATION_URL: string =
    process.env.EMAIL_VERIFICATION_URL!;

  @ValidateIf((o: MailConfig) => !!o.SMTP_HOST)
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  public readonly EMAIL_FORGOT_PASSWORD_URL: string =
    process.env.EMAIL_FORGOT_PASSWORD_URL!;

  get isEnabled(): boolean {
    return !!this.SMTP_HOST;
  }
}
