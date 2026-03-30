import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserBaseResponse } from 'src/api/users/dto/user.base-response';

export class LoginUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginUserResponse {
  user: UserBaseResponse;
  accessToken: string;
}
