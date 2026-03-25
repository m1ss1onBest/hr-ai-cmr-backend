import { Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';

@Injectable()
export class JwtTokensService {
  constructor(private readonly authConfig: AuthConfig) {}
}
