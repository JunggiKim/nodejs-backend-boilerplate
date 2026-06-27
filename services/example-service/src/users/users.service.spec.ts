import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { ErrConflict, ErrNotFound } from '@app/web-infra';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserCommand } from './dto/service/create-user.command';
import { UpdateUserRequest } from './dto/controller/update-user.request';

const buildMockUser = (overrides?: Partial<{ id: number; email: string; name: string; deletedAt: Date | null }>) => ({
  id: overrides?.id ?? 1,
  email: overrides?.email ?? 'test@example.com',
  name: overrides?.name ?? '홍길동',
  passwordHash: '$2b$10$hashedPassword',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  deletedAt: overrides?.deletedAt !== undefined ? overrides.deletedAt : null,
});

const mockUsersRepository = {
  create: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  update: vi.fn(),
  softDelete: vi.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    const createCommand = new CreateUserCommand(
      'test@example.com',
      'password123',
      '홍길동',
    );

    it('새 사용자를 생성하고 UserResponse를 반환해야 한다', async () => {
      const mockUser = buildMockUser();
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createCommand);

      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('홍길동');
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUsersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          name: '홍길동',
        }),
      );
    });

    it('이메일이 중복되면 ErrConflict를 던져야 한다', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(buildMockUser());

      await expect(service.create(createCommand)).rejects.toThrow(ErrConflict);
    });

    it('비밀번호는 해싱되어 저장되어야 한다', async () => {
      const mockUser = buildMockUser();
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(mockUser);

      await service.create(createCommand);

      const callArg = mockUsersRepository.create.mock.calls[0]?.[0] as { passwordHash?: string } | undefined;
      expect(callArg?.passwordHash).toBeDefined();
      expect(callArg?.passwordHash).not.toBe('password123');
    });
  });

  describe('findOne', () => {
    it('ID로 사용자를 조회하고 UserResponse를 반환해야 한다', async () => {
      const mockUser = buildMockUser({ id: 1 });
      mockUsersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
    });

    it('사용자가 없으면 ErrNotFound를 던져야 한다', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(ErrNotFound);
    });
  });

  describe('update', () => {
    const updateRequest: UpdateUserRequest = { name: '이영희' };

    it('사용자 이름을 업데이트하고 UserResponse를 반환해야 한다', async () => {
      const mockUser = buildMockUser();
      const updatedUser = buildMockUser({ name: '이영희' });
      mockUsersRepository.findById.mockResolvedValue(mockUser);
      mockUsersRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateRequest);

      expect(result.name).toBe('이영희');
      expect(mockUsersRepository.update).toHaveBeenCalledWith(1, { name: '이영희' });
    });

    it('사용자가 없으면 ErrNotFound를 던져야 한다', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, updateRequest)).rejects.toThrow(ErrNotFound);
    });
  });

  describe('remove', () => {
    it('사용자를 소프트 삭제해야 한다', async () => {
      const mockUser = buildMockUser();
      mockUsersRepository.findById.mockResolvedValue(mockUser);
      mockUsersRepository.softDelete.mockResolvedValue({ ...mockUser, deletedAt: new Date() });

      await service.remove(1);

      expect(mockUsersRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('사용자가 없으면 ErrNotFound를 던져야 한다', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(ErrNotFound);
    });
  });
});
