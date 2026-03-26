import { Module } from '@nestjs/common';
import { AuthConfig } from './configs';
import { JwtModule } from '@nestjs/jwt';
import { JWT_TOKENS_SERVICE_PROVIDER } from './jwt/jwt.interface';
import { AuthControllerV1 } from './auth.controller.v1';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [AuthConfig],
      useFactory: (config: AuthConfig) => ({
        secret: config.ACCESS_TOKEN_SECRET,
        signOptions: {
          expiresIn: config.ACCESS_TOKEN_EXPIRATION,
        },
      }),
    }),
  ],
  providers: [JWT_TOKENS_SERVICE_PROVIDER],
  controllers: [AuthControllerV1],
  exports: [JWT_TOKENS_SERVICE_PROVIDER],
})
export class AuthModule {}
