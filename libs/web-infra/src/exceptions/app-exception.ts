import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly errorCode: number,
    public readonly errorMessage: string,
    httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ errorCode, errorMessage }, httpStatus);
  }
}

export class ErrNotFound extends AppException {
  constructor(resource: string) {
    super(404, `${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ErrUnauthorized extends AppException {
  constructor(message = 'Unauthorized') {
    super(401, message, HttpStatus.UNAUTHORIZED);
  }
}

export class ErrConflict extends AppException {
  constructor(message: string) {
    super(409, message, HttpStatus.CONFLICT);
  }
}

export class ErrBadRequest extends AppException {
  constructor(message: string) {
    super(400, message, HttpStatus.BAD_REQUEST);
  }
}
