import { Provider } from '@nestjs/common';
import { JwtTokensService } from './jwt.service';

export interface IJwtPayload {
  sub: string;
  email: string;
  role?: string;
  name?: string;
}

export interface IJwtRefreshPayload extends IJwtPayload {
  jti: string;
}

export abstract class IJwtTokensService {
  abstract generateAccessToken(payload: IJwtPayload): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<IJwtPayload | null>;

  abstract generateRefreshToken(payload: IJwtPayload): Promise<{ token: string; jti: string }>;
  abstract verifyRefreshToken(token: string): Promise<IJwtRefreshPayload | null>;
}

export const JWT_TOKENS_SERVICE_PROVIDER: Provider = {
  provide: IJwtTokensService,
  useClass: JwtTokensService,
};
