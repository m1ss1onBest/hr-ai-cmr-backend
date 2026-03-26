import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthControllerV1 } from './auth.controller.v1';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret =
          config.get<string>('JWT_SECRET') ??
          config.get<string>('ACCESS_TOKEN_SECRET') ??
          'dev-secret';

        const expiresRaw =
          config.get<string>('JWT_EXPIRES_IN') ??
          config.get<string>('ACCESS_TOKEN_EXPIRATION');

        const expiresInSeconds = expiresRaw
          ? Number(expiresRaw)
          : 60 * 60 * 24 * 7;

        return {
          secret,
          signOptions: {
            expiresIn: Number.isFinite(expiresInSeconds)
              ? expiresInSeconds
              : 60 * 60 * 24 * 7,
          },
        };
      },
    }),
  ],
  controllers: [AuthControllerV1],
  providers: [AuthService],
})
export class AuthModule {}
