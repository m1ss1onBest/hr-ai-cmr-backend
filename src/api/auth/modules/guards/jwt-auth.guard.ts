import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { JwtTokensService } from '../jwt/jwt.service';
import { User } from 'src/shared/domain/users/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtTokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.get('authorization');

    if (!authHeader)
      throw new UnauthorizedException('No Authorization token provided');

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer')
      throw new UnauthorizedException('Invalid Authorization token format');

    if (!token)
      throw new UnauthorizedException('Authorization token is mssing');

    try {
      const payload = await this.jwtService.verifyAccessToken(token);
      if (!payload) {
        throw new UnauthorizedException(`Invalid authorization token`);
      }

      const user = await this.usersRepo.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException(
          'User associated with this token does not exist',
        );
      }

      request['_user'] = new User({ ...user });
    } catch {
      throw new UnauthorizedException('Invalid or expired authorization token');
    }
    return true;
  }
}
