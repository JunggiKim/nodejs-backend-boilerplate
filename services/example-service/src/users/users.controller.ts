import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserRequest } from './dto/controller/create-user.request';
import { UpdateUserRequest } from './dto/controller/update-user.request';
import { UserResponse } from './dto/controller/user.response';
import { CreateUserCommand } from './dto/service/create-user.command';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 회원가입
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입', description: '새 사용자를 등록합니다' })
  @ApiCreatedResponse({ type: UserResponse })
  async create(@Body() request: CreateUserRequest): Promise<UserResponse> {
    const command = new CreateUserCommand(request.email, request.password, request.name);
    return this.usersService.create(command);
  }

  /**
   * 사용자 조회
   */
  @Get(':id')
  @ApiOperation({ summary: '사용자 조회', description: 'ID로 사용자를 조회합니다' })
  @ApiOkResponse({ type: UserResponse })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    return this.usersService.findOne(id);
  }

  /**
   * 사용자 이름 수정
   */
  @Put(':id')
  @ApiOperation({ summary: '사용자 수정', description: '사용자 이름을 수정합니다' })
  @ApiOkResponse({ type: UserResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateUserRequest,
  ): Promise<UserResponse> {
    return this.usersService.update(id, request);
  }

  /**
   * 회원 탈퇴 (소프트 삭제)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '회원 탈퇴', description: '사용자를 소프트 삭제합니다' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
