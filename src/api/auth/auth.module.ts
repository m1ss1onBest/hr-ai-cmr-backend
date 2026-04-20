import { Module } from '@nestjs/common';
import { AuthConfig } from './modules/configs';
import { JwtModule } from '@nestjs/jwt';
import { JWT_TOKENS_SERVICE_PROVIDER } from './modules/jwt/jwt.interface';
import { AuthControllerV1 } from './auth.controller.v1';
import { AuthService } from './auth.service';
import { REGISTER_USE_CASE_PROVIDER } from './use-cases/register/register.interface';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { LOGIN_USE_CASE_PROVIDER } from './use-cases/login/login.interface';
import { LoggerModule } from 'src/shared/infrastructure/logger/logger.module';
import { JwtRefreshTokenStore } from './modules/jwt/jwt-refresh.store';
import { JwtAuthGuard } from './modules/guards/jwt-auth.guard';
import { JwtAuthMiddleware } from './modules/guards/jwt-auth.middleware';
import { RolesGuard } from './modules/guards/roles.guard';
import { MailModule } from 'src/shared/infrastructure/mail/mail.module';
import { RedisModule } from 'src/shared/infrastructure/redis/redis.module';
import { CryptoModule } from 'src/shared/infrastructure/crypto/crypto.module';
import { FORGOT_PASSWORD_REQUEST_USE_CASE_PROVIDER } from './use-cases/forgot-password-request/forgot-password-request.interface';
import { SET_PASSWORD_USE_CASE_PROVIDER } from './use-cases/set-password/set-password.interface';

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
    LoggerModule,
    MailModule,
    RedisModule,
    CryptoModule,
  ],
  controllers: [AuthControllerV1],
  providers: [
    AuthService,
    JWT_TOKENS_SERVICE_PROVIDER,
    JwtRefreshTokenStore,
    JwtAuthGuard,
    JwtAuthMiddleware,
    RolesGuard,
    REGISTER_USE_CASE_PROVIDER,
    LOGIN_USE_CASE_PROVIDER,
    FORGOT_PASSWORD_REQUEST_USE_CASE_PROVIDER,
    SET_PASSWORD_USE_CASE_PROVIDER,
  ],
  exports: [
    JWT_TOKENS_SERVICE_PROVIDER,
    JwtRefreshTokenStore,
    JwtAuthGuard,
    JwtAuthMiddleware,
    RolesGuard,
    REGISTER_USE_CASE_PROVIDER,
    LOGIN_USE_CASE_PROVIDER,
    FORGOT_PASSWORD_REQUEST_USE_CASE_PROVIDER,
    SET_PASSWORD_USE_CASE_PROVIDER,
  ],
})
export class AuthModule {}
