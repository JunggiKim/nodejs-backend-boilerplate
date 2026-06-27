import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../services/example-service/src/app.module';
import { HttpExceptionFilter, ResponseInterceptor } from '../libs/web-infra/src';
import { PrismaService } from '../libs/database/src';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: { email: { contains: 'e2e-test' } },
    });
    await app.close();
  });

  describe('POST /api/v1/users (회원가입)', () => {
    it('유효한 데이터로 사용자를 생성해야 한다', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'e2e-test@example.com',
          password: 'password123',
          name: '홍길동',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        code: 200,
        data: {
          email: 'e2e-test@example.com',
          name: '홍길동',
        },
      });
    });

    it('이메일 중복 시 409를 반환해야 한다', async () => {
      await request(app.getHttpServer()).post('/api/v1/users').send({
        email: 'e2e-test-dup@example.com',
        password: 'password123',
        name: '홍길동',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'e2e-test-dup@example.com',
          password: 'password123',
          name: '홍길동',
        })
        .expect(409);

      expect(response.body.errorMessage).toBeDefined();
    });

    it('유효하지 않은 이메일로 요청 시 400을 반환해야 한다', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: '홍길동',
        })
        .expect(400);
    });
  });
});
