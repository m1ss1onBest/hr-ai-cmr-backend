import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import aiConfig from './config/index';
import { IAiProvider } from './contracts/ai-provider.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { AiService } from './ai.service';
import { DisabledAiProvider } from './providers/disabled-ai.provider';

@Module({
  imports: [ConfigModule.forFeature(aiConfig)],
  providers: [
    {
      provide: IAiProvider,
      useFactory: (cfg: { apiKey?: string }) => {
        return cfg?.apiKey
          ? new GeminiProvider(cfg as any)
          : new DisabledAiProvider();
      },
      inject: [aiConfig.KEY],
    },
    AiService,
  ],
  exports: [AiService],
})
export class AiModule {}
