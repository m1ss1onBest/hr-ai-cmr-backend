import { Module } from '@nestjs/common';
import { TokensSerivce } from './tokens.service';

export const CRYPTO_MODULE_PROVIDERS = [TokensSerivce];

@Module({
  imports: [],
  exports: [...CRYPTO_MODULE_PROVIDERS],
  providers: [...CRYPTO_MODULE_PROVIDERS],
})
export class CryptoModule {}
