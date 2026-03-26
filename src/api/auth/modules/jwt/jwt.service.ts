import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload, IJwtTokensService } from './jwt.interface';

@Injectable()
export class JwtTokensService implements IJwtTokensService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: IJwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async verifyAccessToken(token: string): Promise<IJwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<IJwtPayload>(token);
    } catch {
      // throw new BadRequestException(
      //   `Failed to verify access token ${token}. Error: ${error}`,
      // );
      return null;
    }
  }
}
