export abstract class IAiProvider {
  abstract chat(prompt: string, systemPrompt?: string): Promise<string>;

  abstract analyzeStructured<T>(
    prompt: string,
    systemPrompt: string,
  ): Promise<T>;

  //abstract analuzeStructuredFile<T>(
  //  fileUrl: string,
  //  systemPromt: string,
  //): Promise<T>;
}
