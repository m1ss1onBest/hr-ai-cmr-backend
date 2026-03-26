import { Global, Module } from '@nestjs/common';
import { AuthConfig } from '../../../api/auth/configs';
import { DatabaseConfig } from '../database/config';

export const CONFIG_PROVIDERS = [AuthConfig, DatabaseConfig];

@Global()
@Module({
  imports: [],
  exports: [...CONFIG_PROVIDERS],
  providers: [...CONFIG_PROVIDERS],
})
export class ConfigurationModule {}
