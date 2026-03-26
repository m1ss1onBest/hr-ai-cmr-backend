import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Config } from '../../../../shared/infrastructure/config';
import { StringValue } from 'ms';
import { IsMsString } from 'src/shared/infrastructure/decorators/ms-string.decorator';

@Config()
@Injectable()
export class AuthConfig {
  @IsNotEmpty()
  public readonly ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  @IsNotEmpty()
  @IsMsString()
  public readonly ACCESS_TOKEN_EXPIRATION: StringValue = process.env
    .ACCESS_TOKEN_EXPIRATION as StringValue;
}
