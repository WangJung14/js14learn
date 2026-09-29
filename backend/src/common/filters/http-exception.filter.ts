import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

interface ExceptionResponseObject {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as string | ExceptionResponseObject)
        : { message: 'Internal server error' };

    let message: string | string[] = 'An error occurred';
    let errorName = 'InternalServerError';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      errorName = exception instanceof HttpException ? exception.name : 'Error';
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      if (exceptionResponse.message) {
        message = exceptionResponse.message;
      }
      if (exceptionResponse.error) {
        errorName = exceptionResponse.error;
      } else if (exception instanceof HttpException) {
        errorName = exception.name;
      }
    }

    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - Status ${status}`,
        exception,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
