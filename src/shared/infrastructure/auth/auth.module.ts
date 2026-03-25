import { Module } from '@nestjs/common';
import { JwtTokensService } from './jwt.service';
import { AuthConfig } from './auth.config';

@Module({
  imports: [],
  providers: [JwtTokensService, AuthConfig],
  exports: [JwtTokensService, AuthConfig],
})
export class AuthModule {}
