export abstract class IAiProvider {
  abstract chat(prompt: string, systemPrompt?: string): Promise<string>;

  abstract analyzeStructured<T>(
    prompt: string,
    systemPrompt: string,
  ): Promise<T>;
}
