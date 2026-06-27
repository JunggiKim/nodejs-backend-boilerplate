import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResult } from '../api-result/api-result';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResult<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResult<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return ApiResult.empty() as ApiResult<T>;
        }
        return ApiResult.success(data);
      }),
    );
  }
}
