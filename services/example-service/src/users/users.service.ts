import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ErrConflict, ErrNotFound } from '@app/web-infra';
import { CreateUserCommand } from './dto/service/create-user.command';
import { UpdateUserRequest } from './dto/controller/update-user.request';
import { UserResponse } from './dto/controller/user.response';
import { CreateUserDbDto } from './dto/repository/create-user-db.dto';
import { UsersRepository } from './users.repository';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private static readonly SALT_ROUNDS = 10;

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(command: CreateUserCommand): Promise<UserResponse> {
    const existing = await this.usersRepository.findByEmail(command.email);
    if (existing) {
      throw new ErrConflict('이미 사용 중인 이메일입니다');
    }

    const passwordHash = await bcrypt.hash(command.password, UsersService.SALT_ROUNDS);

    const user = await this.usersRepository.create(
      new CreateUserDbDto(command.email, command.name, passwordHash)
    );

    return UserResponse.from(user);
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new ErrNotFound('User');
    }
    return UserResponse.from(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: number, request: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new ErrNotFound('User');
    }

    const updated = await this.usersRepository.update(id, { name: request.name });
    return UserResponse.from(updated);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new ErrNotFound('User');
    }

    await this.usersRepository.softDelete(id);
  }
}
