import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Middleware wrapper around JwtAuthGuard.
 * Applied to /api/* and skips public auth routes.
 */
@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly guard: JwtAuthGuard) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = (req as unknown as { path?: string }).path ?? '';

    // Only protect API routes
    if (!path.startsWith('/api/')) return next();

    // Public routes
    if (
      path.startsWith('/api/auth/login') ||
      path.startsWith('/api/auth/register') ||
      path.startsWith('/api/auth/refresh') ||
      path.startsWith('/api/auth/logout')
    ) {
      return next();
    }

    try {
      // Create a minimal ExecutionContext-like object
      const ctx = {
        switchToHttp: () => ({
          getRequest: () => req,
        }),
      } as unknown as Parameters<JwtAuthGuard['canActivate']>[0];

      const ok = await this.guard.canActivate(ctx);
      if (!ok) throw new UnauthorizedException();
      return next();
    } catch (e) {
      return next(e);
    }
  }
}
