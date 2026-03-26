import { Module } from '@nestjs/common';
import { JwtTokensService } from './jwt.service';
import { AuthConfig } from './auth.config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [JwtTokensService, AuthConfig, JwtService],
  exports: [JwtTokensService, AuthConfig],
})
export class AuthModule {}
