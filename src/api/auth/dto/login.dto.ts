import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
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
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'User password',
    example: 'password123',
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
