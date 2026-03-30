import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserBaseResponse } from 'src/api/users/dto/user.base-response';

export class LoginUserRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'john@mail.com',
  })
  email: string;

  @IsString()
  @IsStrongPassword()
  @ApiProperty({
    description: 'User password',
    example: '!Password!',
  })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    type: UserBaseResponse,
    description: 'User data',
  })
  user: UserBaseResponse;

  @ApiProperty({
    description: 'JWT acces token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI... <example token>',
  })
  accessToken: string;
}
