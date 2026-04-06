import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import aiConfig from './config/index';
import { IAiProvider } from './contracts/ai-provider.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule.forFeature(aiConfig)],
  providers: [
    {
      provide: IAiProvider,
      useClass: GeminiProvider,
    },
    AiService,
  ],
  exports: [AiService],
})
export class AiModule {}
