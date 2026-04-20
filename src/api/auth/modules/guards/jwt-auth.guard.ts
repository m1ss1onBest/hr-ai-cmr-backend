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
import { ACCESS_TOKEN_COOKIE_NAME } from '../jwt/jwt.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: IJwtTokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthRequest & { cookies?: Record<string, string> }>();

    // Prefer httpOnly cookie
    const cookieToken = request.cookies?.[ACCESS_TOKEN_COOKIE_NAME];

    // Fallback to Authorization header for tooling/backward compatibility
    const headersObj = (request as unknown as { headers?: unknown }).headers;

    let headerToken: string | undefined;

    if (headersObj && typeof headersObj === 'object') {
      const record = headersObj as Record<
        string,
        string | string[] | undefined
      >;
      const authHeader = record['authorization'] ?? record['Authorization'];
      if (authHeader) {
        const [bearer, token] = String(authHeader).split(' ') ?? [];
        if (bearer === 'Bearer' && token) {
          headerToken = token;
        }
      }
    }

    const token = cookieToken ?? headerToken;

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      const payload = await this.jwtService.verifyAccessToken(token);

      if (!payload) {
        throw new UnauthorizedException(
          'Invalid or expired authorization token',
        );
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
