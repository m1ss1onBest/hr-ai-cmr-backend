import { Injectable } from '@nestjs/common';
import {
  SetPasswordRequest,
  SetPasswordResponse,
} from '../../dto/set-password.dto';
import { ISetPasswordUseCase } from './set-password.interface';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { RedisService } from 'src/shared/infrastructure/redis/redis.service';
import { TokensSerivce } from 'src/shared/infrastructure/crypto/tokens.service';

@Injectable()
export class SetPasswordUseCase implements ISetPasswordUseCase {
  constructor(
    private readonly event: EventHandlerLogger,
    private readonly usersRepository: UsersRepository,
    private readonly redisService: RedisService,
    private readonly tokensService: TokensSerivce,
  ) {
    this.event.setContext(SetPasswordUseCase.name);
  }

  async run(request: SetPasswordRequest): Promise<SetPasswordResponse> {
    const hash = this.tokensService.hash(request.token);
    const userId = await this.redisService.getValue(`reset:${hash}`);
    const user = await this.usersRepository.findOneById(userId!);

    if (!user) {
      this.event.badRequest(
        `Cannot set password for user. Invalid reset token`,
      );
    }

    try {
      const newPass = await this.tokensService.hashPassword(
        request.newPassword,
      );
      await this.usersRepository.updatePassword(user.id, newPass);
      const msg = `User ${user.id} password has been successfully updated`;
      this.event.log(msg);
      return {
        message: msg,
      };
    } catch (err) {
      this.event.internal(`Failed to update user passsword`, err);
    }
  }
}
