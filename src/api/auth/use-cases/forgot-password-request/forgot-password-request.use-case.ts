import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/shared/infrastructure/redis/redis.service';
import { ForgotPasswordRequestResponse } from '../../dto/forgot-password-request.dto';
import { IForgotPasswordRequestUseCase } from './forgot-password-request.interface';
import { TokensSerivce as TokensService } from 'src/shared/infrastructure/crypto/tokens.service';
import { MailService } from 'src/shared/infrastructure/mail/mail.service';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { AuthConfig } from '../../modules/configs';
import ms from 'ms';

@Injectable()
export class ForgotPasswordRequestUseCase implements IForgotPasswordRequestUseCase {
  private readonly logger = new EventHandlerLogger(
    ForgotPasswordRequestUseCase.name,
  );

  constructor(
    private readonly redisService: RedisService,
    private readonly tokensService: TokensService,
    private readonly mailService: MailService,
    private readonly usersRepository: UsersRepository,
    private readonly config: AuthConfig,
  ) {}

  async run(email: string): Promise<ForgotPasswordRequestResponse> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) {
      this.logger.notFound(
        `Failed to reset password. User with ${email} email does not exist`,
      );
    }

    const resetPasswordToken = this.tokensService.generateToken();

    const expirationMs = ms(this.config.RESET_PASSWORD_EXPIRATION);
    const expirationSecs = Math.floor(expirationMs / 1000);

    await this.redisService.setValue(
      `reset:${resetPasswordToken.hash}`,
      user!.id,
      expirationSecs,
    );

    try {
      await this.mailService.sendForgotPassword(
        user!.email,
        resetPasswordToken.value,
      );
    } catch (err) {
      this.logger.badRequest(
        `Failed to send email to ${user!.email}. Make sure this email is correct`,
        err,
      );
    }

    const msg = `Password reset request was successfully sent to ${user!.email}`;
    this.logger.log(msg);
    return { message: msg };
  }
}
