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
  token: string;

  @IsStrongPassword()
  newPassword: string;
}

export class SetPasswordResponse {
  message: string;
}
