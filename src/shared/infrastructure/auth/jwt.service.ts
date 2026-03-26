import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from './auth.config';

export interface IJwtPayload {
  id: string;
  email: string;
}

export abstract class IJwtTokensService {
  abstract generateAccessToken(payload: IJwtPayload): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<IJwtPayload | null>;
}

@Injectable()
export class JwtTokensService implements IJwtTokensService {
  constructor(
    private readonly authConfig: AuthConfig,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.authConfig.ACCESS_TOKEN_SECRET,
    });
  }

  async verifyAccessToken(token: string): Promise<IJwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<IJwtPayload>(token, {
        secret: this.authConfig.ACCESS_TOKEN_SECRET,
      });
    } catch {
      // throw new BadRequestException(
      //   `Failed to verify access token ${token}. Error: ${error}`,
      // );
      return null;
    }
  }
}
