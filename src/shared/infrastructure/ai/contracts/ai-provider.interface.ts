export abstract class IAiProvider {
  abstract chat(prompt: string, systemPrompt?: string): Promise<string>;

  abstract analyzeStructured<T>(
    prompt: string,
    systemPrompt: string,
  ): Promise<T>;

  abstract analyzeFile<T>(
    file: Buffer,
    mimeType: string,
    systemPrompt: string,
  ): Promise<T>;
}
