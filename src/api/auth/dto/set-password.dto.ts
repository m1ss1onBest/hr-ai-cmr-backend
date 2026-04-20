import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexadecimal,
  IsNotEmpty,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class SetPasswordRequest {
  @IsNotEmpty()
  @IsHexadecimal()
  @Length(64, 64)
  @ApiProperty({
    description: 'User set password one-time token',
    example: '515d53c53c0851826e0999a54f24ede0f9794d8dc105f02fb75fcbd380d2dd9e',
  })
  token: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User new password',
    example: '!Password2',
  })
  password: string;
}

export class SetPasswordResponse {
  message: string;
}
