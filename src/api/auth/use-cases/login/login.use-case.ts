export {};
import { Injectable } from '@nestjs/common';
import { ILoginUseCase } from './login.interface';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import bcrypt from 'bcryptjs';
import { LoginUserRequest, LoginUserResponse } from '../../dto';
import { User } from 'src/shared/domain/users/user.entity';
import { IJwtTokensService } from '../../modules/jwt/jwt.interface';

@Injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly event: EventHandlerLogger,
    private readonly jwtService: IJwtTokensService,
  ) {
    this.event.setContext(LoginUseCase.name);
  }

  async run(request: LoginUserRequest): Promise<LoginUserResponse> {
    const user = await this.usersRepo.findOneByEmail(request.email);

    if (!user) {
      this.event.badRequest('Failed to login user. Wrong email or password.');
    }

    const passwordVerificaionRes = await bcrypt.compare(
      request.password,
      user.password,
    );

    if (!passwordVerificaionRes) {
      this.event.badRequest('Failed to login user. Wrong email or password.');
    }

    const accessToken = await this.jwtService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    this.event.log('User logged in successfully');
    return {
      user: new User(user).safe(),
      accessToken,
    };
  }
}
