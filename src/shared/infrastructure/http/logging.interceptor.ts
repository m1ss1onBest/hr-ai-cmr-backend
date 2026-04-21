import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventHandlerLogger } from '../logger/handler-logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new EventHandlerLogger(HttpLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req?.method;
    const url = req?.originalUrl ?? req?.url;
    const userId = req?._user?.id;
    const start = Date.now();

    // keep body small-ish in logs
    const body = req?.body;

    this.logger.log(
      `HTTP ${method} ${url} user=${userId ?? '-'} body=${body ? JSON.stringify(body) : '-'}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.logger.log(`HTTP ${method} ${url} -> ok (${ms}ms)`);
        },
        error: (err) => {
          const ms = Date.now() - start;
          this.logger.warn(
            `HTTP ${method} ${url} -> error (${ms}ms) ${err?.message ?? err}`,
          );
        },
      }),
    );
  }
}

