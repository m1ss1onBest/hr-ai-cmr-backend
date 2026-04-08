import { Injectable } from '@nestjs/common';
import { IAiProvider } from '../contracts/ai-provider.interface';

/**
 * Provider used when AI is not configured (e.g., missing GEMINI_API_KEY).
 *
 * This lets the Nest app boot, while any AI-dependent feature returns
 * a clear runtime error.
 */
@Injectable()
export class DisabledAiProvider extends IAiProvider {
  async chat(): Promise<string> {
    throw new Error(
      'AI provider is disabled. Please set GEMINI_API_KEY in the .env file to enable AI features.',
    );
  }

  async analyzeStructured<T>(): Promise<T> {
    throw new Error(
      'AI provider is disabled. Please set GEMINI_API_KEY in the .env file to enable AI features.',
    );
  }
}

