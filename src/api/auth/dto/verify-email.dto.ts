import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john@mail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  @ApiProperty({ example: 'abc123token' })
  token: string;
}

export class VerifyEmailResponse {
  @ApiProperty({ example: true })
  ok: boolean;
}
