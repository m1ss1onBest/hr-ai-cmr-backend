import { IsNotEmpty } from 'class-validator';
import { Config } from '../config';

@Config()
export class AuthConfig {
  @IsNotEmpty()
  public readonly ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  @IsNotEmpty()
  public readonly ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
}
