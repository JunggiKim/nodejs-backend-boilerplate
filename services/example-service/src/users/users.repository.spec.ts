import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@ext/database';
import { UsersRepository } from './users.repository';
import { CreateUserDbDto } from './dto/repository/create-user-db.dto';

const buildMockUser = (overrides?: Partial<{ id: number; email: string; name: string }>) => ({
  id: overrides?.id ?? 1,
  email: overrides?.email ?? 'test@example.com',
  name: overrides?.name ?? '홍길동',
  passwordHash: 'hashedPassword',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  deletedAt: null,
});

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  describe('create', () => {
    it('새 사용자를 생성하고 반환해야 한다', async () => {
      const mockUser = buildMockUser();
      prismaMock.user.create.mockResolvedValue(mockUser);

      const dbDto = new CreateUserDbDto('test@example.com', '홍길동', 'hashedPassword');
      const result = await repository.create(dbDto);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: '홍길동',
          passwordHash: 'hashedPassword',
        },
      });
    });
  });

  describe('findById', () => {
    it('ID로 사용자를 조회해야 한다', async () => {
      const mockUser = buildMockUser({ id: 1 });
      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      const result = await repository.findById(1);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null },
      });
    });

    it('존재하지 않는 사용자는 null을 반환해야 한다', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('이메일로 사용자를 조회해야 한다', async () => {
      const mockUser = buildMockUser({ email: 'test@example.com' });
      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: null },
      });
    });
  });

  describe('update', () => {
    it('사용자 정보를 업데이트해야 한다', async () => {
      const mockUser = buildMockUser({ name: '이영희' });
      prismaMock.user.update.mockResolvedValue(mockUser);

      const result = await repository.update(1, { name: '이영희' });

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: '이영희' },
      });
    });
  });

  describe('softDelete', () => {
    it('사용자를 소프트 삭제해야 한다 (deletedAt 설정)', async () => {
      const deletedAt = new Date();
      const mockUser = { ...buildMockUser(), deletedAt };
      prismaMock.user.update.mockResolvedValue(mockUser);

      const result = await repository.softDelete(1);

      expect(result.deletedAt).not.toBeNull();
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) as Date },
      });
    });
  });
});
