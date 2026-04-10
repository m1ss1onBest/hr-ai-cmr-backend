import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class TokensSerivce {
  constructor() {}

  generateToken(): { value: string; hash: string } {
    const token = randomBytes(32).toString('hex');
    const hash = this.hash(token);
    return { value: token, hash };
  }

  hash(str: string): string {
    return createHash('sha256').update(str).digest('hex');
  }

  async hashPassword(str: string): Promise<string> {
    return await bcrypt.hash(str, 10);
  }
}
