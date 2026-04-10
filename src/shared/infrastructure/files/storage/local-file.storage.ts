import { Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';
import filesConfig from '../files.config';
import { IFileStorage } from './storage.interface';

@Injectable()
export class LocalFileStorage extends IFileStorage {
  constructor(
    @Inject(filesConfig.KEY)
    private readonly cfg: ConfigType<typeof filesConfig>,
  ) {
    super();
  }

  async saveResume(params: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    candidateId: string;
  }): Promise<{ url: string }> {
    const uploadRoot = path.resolve(process.cwd(), this.cfg.uploadDir);
    const ext = this.safeExt(params.originalName, params.mimeType);
    const fileName = `${params.candidateId}_${Date.now()}_${crypto.randomUUID()}${ext}`;

    await fs.mkdir(uploadRoot, { recursive: true });

    const absPath = path.join(uploadRoot, fileName);
    await fs.writeFile(absPath, params.buffer);

    return { url: `/${this.cfg.uploadDir}/${fileName}`.replace(/\\/g, '/') };
  }

  resolveLocalPath(urlOrPath: string): string | null {
    const normalized = urlOrPath.replace(/\\/g, '/');
    // Only allow serving from /uploads/... (or configured uploadDir)
    const prefix = `/${this.cfg.uploadDir}/`;
    if (!normalized.startsWith(prefix)) return null;

    const relative = normalized.slice(prefix.length);
    const abs = path.resolve(process.cwd(), this.cfg.uploadDir, relative);

    // Basic traversal protection
    const root = path.resolve(process.cwd(), this.cfg.uploadDir);
    if (!abs.startsWith(root)) return null;

    return abs;
  }

  private safeExt(originalName: string, mimeType: string): string {
    const lower = originalName.toLowerCase();
    if (lower.endsWith('.pdf')) return '.pdf';
    if (lower.endsWith('.docx')) return '.docx';

    // fallback based on mime
    if (mimeType === 'application/pdf') return '.pdf';
    if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      return '.docx';

    // default - don't trust unknown
    return '';
  }
}
