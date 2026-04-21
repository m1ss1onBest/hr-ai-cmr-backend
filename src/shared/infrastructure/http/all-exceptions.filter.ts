import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EventHandlerLogger } from '../logger/handler-logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new EventHandlerLogger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpResponse = isHttp ? exception.getResponse() : undefined;

    const message = isHttp
      ? typeof httpResponse === 'string'
        ? httpResponse
        : (httpResponse as any)?.message ?? httpResponse
      : (exception as any)?.message;

    this.logger.warn(
      `EXCEPTION ${request?.method} ${request?.originalUrl ?? request?.url} ` +
        `status=${status} user=${request?._user?.id ?? '-'} ` +
        `message=${typeof message === 'string' ? message : JSON.stringify(message)}`,
    );

    // Always respond here (don't rethrow) so the client sees the actual validation message.
    response.status(status).json(
      isHttp
        ? httpResponse
        : {
            statusCode: status,
            message: (exception as any)?.message ?? 'Internal server error',
          },
    );
  }
}
