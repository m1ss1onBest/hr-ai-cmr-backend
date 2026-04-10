import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  Param,
} from '@nestjs/common';
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from './dto';
import { AuthConfig } from './modules/configs';
import ms from 'ms';
import { AuthService } from './auth.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from './modules/jwt/jwt.constants';
import { ApiResponse } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ForgotPasswordRequestResponse } from './dto/forgot-password-request.dto';
import { IForgotPasswordRequestUseCase } from './use-cases/forgot-password-request/forgot-password-request.interface';
import {
  SetPasswordRequest,
  SetPasswordResponse,
} from './dto/set-password.dto';
import { SetPasswordUseCase } from './use-cases/set-password/set-password.use-case';
import { ISetPasswordUseCase } from './use-cases/set-password/set-password.interface';

function setAuthCookies(
  res: Response,
  config: AuthConfig,
  accessToken: string,
  refreshToken: string,
) {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: ms(config.ACCESS_TOKEN_EXPIRATION),
    path: '/api',
  });

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: ms(config.REFRESH_TOKEN_EXPIRATION),
    path: '/api/auth',
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { path: '/api' });
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/api/auth' });
}

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthControllerV1 {
  constructor(
    private readonly authService: AuthService,
    private readonly authConfig: AuthConfig,
    private readonly forgotPasswordRequestUseCase: IForgotPasswordRequestUseCase,
    private readonly setPasswordUseCase: ISetPasswordUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: RegisterUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to register user',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already in use',
  })
  async register(
    @Body() dto: RegisterUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.register(dto);

    setAuthCookies(res, this.authConfig, accessToken, refreshToken);
    return { user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to log in user',
  })
  async login(
    @Body() dto: LoginUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);

    setAuthCookies(res, this.authConfig, accessToken, refreshToken);
    return { user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken: unknown = (req.cookies ?? {})[
      REFRESH_TOKEN_COOKIE_NAME
    ];
    const refreshToken =
      typeof rawRefreshToken === 'string' ? rawRefreshToken : '';

    const { accessToken } = await this.authService.refresh(refreshToken);

    // keep refresh token cookie as is
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: ms(this.authConfig.ACCESS_TOKEN_EXPIRATION),
      path: '/api',
    });

    return { ok: true };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken: unknown = (req.cookies ?? {})[
      REFRESH_TOKEN_COOKIE_NAME
    ];
    const refreshToken =
      typeof rawRefreshToken === 'string' ? rawRefreshToken : '';

    await this.authService.logout(refreshToken);
    clearAuthCookies(res);
  }

  @Post('request-password-reset/:email')
  @HttpCode(200)
  async requestPasswordReset(
    @Param('email') email: string,
  ): Promise<ForgotPasswordRequestResponse> {
    return await this.forgotPasswordRequestUseCase.run(email);
  }

  @Post('set-password')
  @HttpCode(200)
  async setPassword(
    @Body() request: SetPasswordRequest,
  ): Promise<SetPasswordResponse> {
    return await this.setPasswordUseCase.run(request);
  }
}
