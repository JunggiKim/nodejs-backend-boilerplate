import { Test, TestingModule } from '@nestjs/testing';
import { ErrNotFound } from '@app/web-infra';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/controller/create-user.request';
import { UpdateUserRequest } from './dto/controller/update-user.request';
import { UserResponse } from './dto/controller/user.response';
import { CreateUserCommand } from './dto/service/create-user.command';

const buildMockUserResponse = (overrides?: Partial<UserResponse>): UserResponse => ({
  id: overrides?.id ?? 1,
  email: overrides?.email ?? 'test@example.com',
  name: overrides?.name ?? '홍길동',
  createdAt: overrides?.createdAt ?? new Date('2024-01-01'),
  updatedAt: overrides?.updatedAt ?? new Date('2024-01-01'),
});

const mockUsersService = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    const createRequest: CreateUserRequest = {
      email: 'test@example.com',
      password: 'password123',
      name: '홍길동',
    };

    it('새 사용자를 생성하고 UserResponse를 반환해야 한다', async () => {
      const mockResponse = buildMockUserResponse();
      mockUsersService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(createRequest);

      expect(result).toEqual(mockResponse);
      expect(mockUsersService.create).toHaveBeenCalledWith(
        new CreateUserCommand(createRequest.email, createRequest.password, createRequest.name)
      );
    });
  });

  describe('findOne', () => {
    it('ID로 사용자를 조회해야 한다', async () => {
      const mockResponse = buildMockUserResponse({ id: 1 });
      mockUsersService.findOne.mockResolvedValue(mockResponse);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockResponse);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('존재하지 않는 사용자 조회 시 ErrNotFound가 전파되어야 한다', async () => {
      mockUsersService.findOne.mockRejectedValue(new ErrNotFound('User'));

      await expect(controller.findOne(999)).rejects.toThrow(ErrNotFound);
    });
  });

  describe('update', () => {
    const updateRequest: UpdateUserRequest = { name: '이영희' };

    it('사용자를 업데이트해야 한다', async () => {
      const mockResponse = buildMockUserResponse({ name: '이영희' });
      mockUsersService.update.mockResolvedValue(mockResponse);

      const result = await controller.update(1, updateRequest);

      expect(result.name).toBe('이영희');
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateRequest);
    });
  });

  describe('remove', () => {
    it('사용자를 삭제해야 한다', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
