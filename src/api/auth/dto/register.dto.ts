import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { UserBaseResponse } from 'src/api/users/dto/user.base-response';

export class RegisterUserRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    example: 'john@mail.com',
  })
  email: string;

  @IsString()
  @IsStrongPassword(
    {},
    {
      message:
        'The password must be at least 8 characters long, must contain at least 1 uppercase and lowercase leter, number and a special symbol',
    },
  )
  @ApiProperty({
    description: 'User password',
    example: '!Password1',
  })
  password: string;
}

export class RegisterUserResponse extends UserBaseResponse {}
