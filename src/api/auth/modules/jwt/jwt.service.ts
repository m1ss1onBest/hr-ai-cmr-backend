import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../configs';
import { IJwtPayload, IJwtRefreshPayload, IJwtTokensService } from './jwt.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtTokensService implements IJwtTokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConfig: AuthConfig,
  ) {}

  async generateAccessToken(payload: IJwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async verifyAccessToken(token: string): Promise<IJwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<IJwtPayload>(token);
    } catch {
      return null;
    }
  }

  async generateRefreshToken(
    payload: IJwtPayload,
  ): Promise<{ token: string; jti: string }> {
    const jti = randomUUID();

    const token = await this.jwtService.signAsync(
      { ...payload, jti },
      {
        secret: this.authConfig.REFRESH_TOKEN_SECRET,
        expiresIn: this.authConfig.REFRESH_TOKEN_EXPIRATION,
      },
    );

    return { token, jti };
  }

  async verifyRefreshToken(token: string): Promise<IJwtRefreshPayload | null> {
    try {
      return await this.jwtService.verifyAsync<IJwtRefreshPayload>(token, {
        secret: this.authConfig.REFRESH_TOKEN_SECRET,
      });
    } catch {
      return null;
    }
  }
}
