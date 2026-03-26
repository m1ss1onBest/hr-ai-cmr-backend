import { Module } from '@nestjs/common';
import { AuthConfig } from './modules/configs';
import { JwtModule } from '@nestjs/jwt';
import { JWT_TOKENS_SERVICE_PROVIDER } from './modules/jwt/jwt.interface';
import { AuthControllerV1 } from './auth.controller.v1';
import { REGISTER_USE_CASE_PROVIDER } from './use-cases/register/register.interface';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';

export const AUTH_MODULE_PROVIDERS = [
  JWT_TOKENS_SERVICE_PROVIDER,
  REGISTER_USE_CASE_PROVIDER,
];

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
    DatabaseModule,
  ],
  controllers: [AuthControllerV1],
  providers: [...AUTH_MODULE_PROVIDERS],
})
export class AuthModule {}
