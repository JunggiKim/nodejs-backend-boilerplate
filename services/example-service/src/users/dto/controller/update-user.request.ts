import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserRequest {
  /**
   * 변경할 사용자 이름
   * @example "이영희"
   */
  @ApiProperty({ example: '이영희', description: '변경할 사용자 이름' })
  @IsString()
  @MinLength(1, { message: '이름을 입력해주세요' })
  name!: string;
}
