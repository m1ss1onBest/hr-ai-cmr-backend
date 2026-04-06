import { IAiProvider } from '../contracts/ai-provider.interface';
import { Injectable, Inject } from '@nestjs/common';
import { EventHandlerLogger } from '../../logger/handler-logger.service';
import { GoogleGenAI } from '@google/genai';
import aiConfig from '../config/index';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class GeminiProvider extends IAiProvider {
  private readonly client: GoogleGenAI;
  private readonly logger = new EventHandlerLogger(GeminiProvider.name);

  constructor(
    @Inject(aiConfig.KEY)
    private readonly config: ConfigType<typeof aiConfig>,
  ) {
    super();
    if (!this.config.apiKey) {
      this.logger.internal(
        'GEMINI_API_KEY is not configured. Please set it in the .env file.',
      );
    }
    this.client = new GoogleGenAI({ apiKey: this.config.apiKey });
  }

  async chat(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          abortSignal: AbortSignal.timeout(this.config.timeoutMs),
        },
      });

      if (!response.text) {
        this.logger.internal('AI returned empty response');
      }

      return response.text!;
    } catch (error) {
      return this.handleAiError(error);
    }
  }

  async analyzeStructured<T>(prompt: string, systemPrompt: string): Promise<T> {
    try {
      const response = await this.client.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          abortSignal: AbortSignal.timeout(this.config.timeoutMs),
        },
      });

      if (!response.text) {
        this.logger.internal('AI returned empty response for structured query');
      }

      return JSON.parse(response.text!) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.logger.internal(
          'AI returned invalid JSON. Failed to parse response.',
          error,
        );
      }
      return this.handleAiError(error);
    }
  }

  private handleAiError(error: unknown): never {
    if (error && typeof error === 'object' && 'getStatus' in error) {
      throw error as unknown as Error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorRecord = error as Record<string, unknown>;
    const statusCode =
      errorRecord?.status ?? errorRecord?.statusCode ?? errorRecord?.code;

    // Timeout (AbortSignal)
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      this.logger.requestTimeout(
        `AI request timed out after ${this.config.timeoutMs}ms`,
        error,
      );
    }

    // AbortError
    if (error instanceof DOMException && error.name === 'AbortError') {
      this.logger.requestTimeout('AI request was aborted', error);
    }

    // Rate limit (429 / RESOURCE_EXHAUSTED)
    if (
      statusCode === 429 ||
      errorMessage.includes('429') ||
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      errorMessage.includes('Too Many Requests')
    ) {
      this.logger.tooManyRequests(
        'AI service rate limit exceeded. Please retry later.',
        error,
      );
    }

    // Service unavailable (503, network errors)
    if (
      statusCode === 503 ||
      errorMessage.includes('503') ||
      errorMessage.includes('UNAVAILABLE') ||
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ENOTFOUND')
    ) {
      this.logger.serviceUnavailable(
        'AI service is temporarily unavailable. Please try again later.',
        error,
      );
    }

    throw this.buildServiceUnavailableError(errorMessage, error);
  }

  private buildServiceUnavailableError(
    errorMessage: string,
    error: unknown,
  ): Error {
    this.logger.error(`AI service error: ${errorMessage}`, error);
    return new Error(`AI service error: ${errorMessage}`);
  }
}
