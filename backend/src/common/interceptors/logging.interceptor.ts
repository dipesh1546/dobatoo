import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode;
          const responseTime = Date.now() - now;
          this.logger.log(
            JSON.stringify({
              timestamp,
              method,
              endpoint: originalUrl,
              statusCode,
              responseTime: `${responseTime}ms`,
              clientIp: ip,
              userAgent,
            }),
          );
        },
        error: (error) => {
          const statusCode = error?.status || 500;
          const responseTime = Date.now() - now;
          this.logger.error(
            JSON.stringify({
              timestamp,
              method,
              endpoint: originalUrl,
              statusCode,
              responseTime: `${responseTime}ms`,
              errorMessage: error?.message || 'Internal Server Error',
              clientIp: ip,
            }),
          );
        },
      }),
    );
  }
}
