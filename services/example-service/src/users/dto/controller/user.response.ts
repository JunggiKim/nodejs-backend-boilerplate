import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserResponse {
  /**
   * 사용자 ID
   * @example 1
   */
  @ApiProperty({ example: 1, description: '사용자 ID' })
  id: number;

  /**
   * 이메일 주소
   * @example "user@example.com"
   */
  @ApiProperty({ example: 'user@example.com', description: '이메일 주소' })
  email: string;

  /**
   * 사용자 이름
   * @example "홍길동"
   */
  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  name: string;

  /**
   * 생성 일시
   */
  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  /**
   * 수정 일시
   */
  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static from(user: User): UserResponse {
    return new UserResponse(user);
  }
}
