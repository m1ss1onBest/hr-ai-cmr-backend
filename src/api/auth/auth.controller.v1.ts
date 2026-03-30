import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserRequest, RegisterUserRequest } from './dto';
import { IRegisterUseCase } from './use-cases/register/register.interface';
import { ILoginUseCase } from './use-cases/login/login.interface';

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
  register(@Body() dto: RegisterUserRequest) {
    return this.registerUseCase.run(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserRequest) {
    return this.loginUseCase.run(dto);
  }
}
