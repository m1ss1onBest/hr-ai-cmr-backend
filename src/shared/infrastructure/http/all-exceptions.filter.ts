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

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)
        : (exception as any)?.message;

    this.logger.warn(
      `EXCEPTION ${request?.method} ${request?.originalUrl ?? request?.url} ` +
        `status=${status} user=${request?._user?.id ?? '-'} ` +
        `message=${typeof message === 'string' ? message : JSON.stringify(message)}`,
    );

    // let Nest handle default formatting for HttpException if it can
    if (exception instanceof HttpException) {
      throw exception;
    }

    response.status(status).json({
      statusCode: status,
      message: (exception as any)?.message ?? 'Internal server error',
    });
  }
}

