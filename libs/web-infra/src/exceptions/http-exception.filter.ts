import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResult } from '../api-result/api-result';
import { AppException } from './app-exception';

interface HttpExceptionBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const traceId = (request.headers['x-trace-id'] as string | undefined) ?? null;

    if (exception instanceof AppException) {
      const result = ApiResult.error(exception.errorCode, exception.errorMessage, traceId ?? undefined);
      response.status(exception.getStatus()).json(result);
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse() as HttpExceptionBody | string;

      let message: string;
      if (typeof body === 'string') {
        message = body;
      } else if (Array.isArray(body.message)) {
        message = body.message.join(', ');
      } else {
        message = body.message ?? exception.message;
      }

      const result = ApiResult.error(status, message, traceId ?? undefined);
      response.status(status).json(result);
      return;
    }

    this.logger.error('Unhandled exception', exception);
    const result = ApiResult.error(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      traceId ?? undefined,
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result);
  }
}
