import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/infrastructure/database/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  type PrismaMock = {
    user: {
      findUnique: jest.MockedFunction<(args: unknown) => Promise<unknown>>;
      create: jest.MockedFunction<(args: unknown) => Promise<unknown>>;
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const getPrismaMock = () => app.get(PrismaService) as unknown as PrismaMock;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: () => Promise.resolve(),
        $disconnect: () => Promise.resolve(),
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockRejectedValue(new Error('Not implemented in test')),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  it('/api/auth/login (POST) -> 400 on invalid data', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'short' })
      .expect(400);
  });

  it('/api/auth/login (POST) -> 401 when user not found', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'missing@example.com', password: 'password123' })
      .expect(401);
  });

  it('/api/auth/login (POST) -> 401 when password invalid', async () => {
    const bcrypt = await import('bcryptjs');

    const existingUser = {
      id: 'u_1',
      email: 'user@example.com',
      name: 'John',
      password: await bcrypt.default.hash('correct-password', 10),
      role: 'HR',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const prisma = getPrismaMock();

    prisma.user.findUnique.mockResolvedValue(existingUser);

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'wrong-password' })
      .expect(401);
  });

  it('/api/auth/register (POST) -> 201 and passes name to DB create', async () => {
    const prisma = getPrismaMock();

    prisma.user.findUnique.mockResolvedValue(null);

    prisma.user.create.mockResolvedValue({
      id: 'u_1',
      email: 'new@example.com',
      name: 'Іван',
      password: 'hashed',
      role: 'HR',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ name: 'Іван', email: 'new@example.com', password: '!Password1' })
      .expect(201);

    const firstCallArg = prisma.user.create.mock.calls[0]?.[0] as {
      data: { name: string; email: string };
    };

    expect(firstCallArg.data.name).toBe('Іван');
    expect(firstCallArg.data.email).toBe('new@example.com');
  });
});
