import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserRequest, RegisterUserResponse } from './dto/register.dto';
import { IRegisterUseCase } from './use-cases/register/register.interface';

@Controller('/v1/auth')
export class AuthControllerV1 {
  constructor(private readonly registerUseCase: IRegisterUseCase) {}

  // All busines logic is stored in register use case instead of services now
  @Post('/register')
  async registerUser(
    @Body() request: RegisterUserRequest,
  ): Promise<RegisterUserResponse> {
    return await this.registerUseCase.run(request);
  }

  // Some example methods
  loginUser() {}
  logoutUser() {}
  verifyUser() {}
  forgotPassword() {}
}
