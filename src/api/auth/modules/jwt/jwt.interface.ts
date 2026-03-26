import { Provider } from '@nestjs/common';
import { JwtTokensService } from './jwt.service';

export interface IJwtPayload {
  sub: string;
  email: string;
}

export abstract class IJwtTokensService {
  abstract generateAccessToken(payload: IJwtPayload): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<IJwtPayload | null>;
}

export const JWT_TOKENS_SERVICE_PROVIDER: Provider = {
  provide: IJwtTokensService,
  useClass: JwtTokensService,
};
