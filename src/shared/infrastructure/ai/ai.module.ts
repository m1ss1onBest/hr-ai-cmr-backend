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
      useFactory: (cfg: {
        apiKey: string;
        model: string;
        timeoutMs: number;
      }) => {
        if (!cfg.apiKey) {
          throw new Error('GEMINI_API_KEY is not configured.');
        }
        return new GeminiProvider(cfg);
      },
      inject: [aiConfig.KEY],
    },
    AiService,
  ],
  exports: [AiService],
})
export class AiInfrastructureModule {}
