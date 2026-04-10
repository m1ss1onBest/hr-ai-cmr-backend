export abstract class IFileStorage {
  /**
   * Returns a public URL or path that can be stored in DB (e.g. /uploads/...).
   */
  abstract saveResume(params: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    candidateId: string;
  }): Promise<{ url: string }>;

  /**
   * Returns absolute file path for local storage.
   */
  abstract resolveLocalPath(urlOrPath: string): string | null;
}
