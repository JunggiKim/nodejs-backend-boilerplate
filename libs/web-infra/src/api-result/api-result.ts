import { ApiProperty } from '@nestjs/swagger';

export class ApiResult<T> {
  @ApiProperty({ nullable: true })
  readonly data: T | null;

  @ApiProperty()
  readonly code: number;

  @ApiProperty({ nullable: true })
  readonly errorMessage: string | null;

  @ApiProperty({ nullable: true })
  readonly traceId: string | null;

  constructor(
    data: T | null,
    code: number,
    errorMessage: string | null = null,
    traceId: string | null = null,
  ) {
    this.data = data;
    this.code = code;
    this.errorMessage = errorMessage;
    this.traceId = traceId;
  }

  static success<T>(data: T): ApiResult<T> {
    return new ApiResult<T>(data, 200);
  }

  static empty(): ApiResult<null> {
    return new ApiResult<null>(null, 200);
  }

  static error(code: number, msg: string, traceId?: string): ApiResult<null> {
    return new ApiResult<null>(null, code, msg, traceId ?? null);
  }
}
