import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterUserRequest, RegisterUserResponse } from './dto/register.dto';
import { IRegisterUseCase } from './use-cases/register/register.interface';
import { JwtAuthGuard } from './modules/guards/jwt-auth.guard';

@Controller('/v1/auth')
export class AuthControllerV1 {
  constructor(private readonly registerUseCase: IRegisterUseCase) {}

  // All busines logic is stored in register use case instead of services now
  @Post('/register')
  @UseGuards(JwtAuthGuard)
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
