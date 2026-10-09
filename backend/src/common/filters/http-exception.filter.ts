import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

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

    const isProduction = process.env.NODE_ENV === 'production';

    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const respObj = exceptionResponse as any;
        message = respObj.message || exception.message;
        if (Array.isArray(respObj.message)) {
          message = 'Validation error';
          details = respObj.message;
        }
      }
    } else if (exception instanceof Error) {
      // In development, show error message for easier debugging.
      // In production, mask raw database or internal code errors.
      message = isProduction ? 'An unexpected database or server error occurred' : exception.message;
    }

    const errorResponseBody = {
      success: false,
      message,
      error: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...(details ? { details } : {}),
        ...(!isProduction && exception instanceof Error
          ? { stack: exception.stack }
          : {}),
      },
    };

    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - Status: ${status} - Error: ${
          exception instanceof Error ? exception.message : message
        }`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`[${request.method}] ${request.url} - Status: ${status} - Message: ${message}`);
    }

    response.status(status).json(errorResponseBody);
  }
}
