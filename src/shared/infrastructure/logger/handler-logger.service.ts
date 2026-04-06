import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

type HttpExceptionConstructor = new (message: string) => any;

@Injectable()
export class EventHandlerLogger extends Logger {
  constructor(context: string) {
    super(context);
  }

  setContext(ctx?: string) {
    this.context = ctx;
  }

  logAndThrow(
    ExceptionCtor: HttpExceptionConstructor,
    msg: string,
    err?: any,
  ): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const errorMessage = `${msg}${err ? ` - ${err.message || err}` : ''}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.error(errorMessage, err?.stack ?? err);
    throw new ExceptionCtor(msg);
  }

  badRequest(msg: string, err?: any): never {
    return this.logAndThrow(BadRequestException, msg, err);
  }

  conflict(msg: string, err?: any): never {
    return this.logAndThrow(ConflictException, msg, err);
  }

  notFound(msg: string, err?: any): never {
    return this.logAndThrow(NotFoundException, msg, err);
  }

  unauthorized(msg: string, err?: any): never {
    return this.logAndThrow(UnauthorizedException, msg, err);
  }

  forbidden(msg: string, err?: any): never {
    return this.logAndThrow(ForbiddenException, msg, err);
  }

  internal(msg: string, err?: any): never {
    return this.logAndThrow(InternalServerErrorException, msg, err);
  }

  tooManyRequests(msg: string, err?: any): never {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const errorMessage = `${msg}${err ? ` - ${err.message || err}` : ''}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.error(errorMessage, err?.stack ?? err);
    throw new HttpException(msg, HttpStatus.TOO_MANY_REQUESTS);
  }

  serviceUnavailable(msg: string, err?: any): never {
    return this.logAndThrow(ServiceUnavailableException, msg, err);
  }

  requestTimeout(msg: string, err?: any): never {
    return this.logAndThrow(RequestTimeoutException, msg, err);
  }
}
