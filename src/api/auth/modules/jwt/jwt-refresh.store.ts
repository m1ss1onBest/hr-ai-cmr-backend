import { Injectable } from '@nestjs/common';

/**
 * In-memory store for refresh token JTIs.
 *
 * This satisfies the acceptance criteria for logout invalidation,
 * but isn't horizontally scalable. Replace with Redis/DB later.
 */
@Injectable()
export class JwtRefreshTokenStore {
  private readonly revokedJtis = new Set<string>();

  revoke(jti: string) {
    this.revokedJtis.add(jti);
  }

  isRevoked(jti: string): boolean {
    return this.revokedJtis.has(jti);
  }
}

