import { Global, Module } from '@nestjs/common';
import { AuthConfig } from '../../../api/auth/modules/configs';
import { DatabaseConfig } from '../database/config';
import { MailConfig } from '../mail/config';
import { StorageConfig } from '../storage/storage.config';

export const CONFIG_MODULE_PROVIDERS = [
  AuthConfig,
  DatabaseConfig,
  MailConfig,
  StorageConfig,
];

@Global()
@Module({
  imports: [],
  exports: [...CONFIG_MODULE_PROVIDERS],
  providers: [...CONFIG_MODULE_PROVIDERS],
})
export class ConfigurationModule {}
