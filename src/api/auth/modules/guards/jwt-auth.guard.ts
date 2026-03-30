import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { User } from 'src/shared/domain/users/user.entity';
import { IJwtTokensService } from '../jwt/jwt.interface';
import { AuthRequest } from './auth-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: IJwtTokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const headersObj = (request as unknown as { headers?: unknown }).headers;

    let authHeader: string | string[] | null | undefined;

    if (headersObj && typeof headersObj === 'object') {
      if (typeof (headersObj as { get?: unknown }).get === 'function') {
        authHeader = (
          headersObj as { get: (name: string) => string | null }
        ).get('authorization');
      } else {
        const record = headersObj as Record<
          string,
          string | string[] | undefined
        >;
        authHeader = record['authorization'] ?? record['Authorization'];
      }
    }

    if (!authHeader)
      throw new UnauthorizedException('No Authorization token provided');

    const [bearer, token] = String(authHeader).split(' ') ?? [];
    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid authorization token');

    const payload = await this.jwtService.verifyAccessToken(token);
    if (!payload)
      throw new UnauthorizedException('Invalid or expired authorization token');

    const user = await this.usersRepo.findOneById(payload.sub);
    if (!user)
      throw new UnauthorizedException(
        'User associated with this token does not exist',
      );

    request['_user'] = new User({ ...user });

    return true;
  }
}
