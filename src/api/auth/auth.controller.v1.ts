import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from './dto';
import { IRegisterUseCase } from './use-cases/register/register.interface';
import { ILoginUseCase } from './use-cases/login/login.interface';
import { ApiResponse } from '@nestjs/swagger';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthControllerV1 {
  constructor(
    private readonly registerUseCase: IRegisterUseCase,
    private readonly loginUseCase: ILoginUseCase,
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
  register(@Body() dto: RegisterUserRequest) {
    return this.registerUseCase.run(dto);
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
  login(@Body() dto: LoginUserRequest) {
    return this.loginUseCase.run(dto);
  }
}
