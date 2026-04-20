process.env.ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? 'access_secret';
process.env.ACCESS_TOKEN_EXPIRATION =
  process.env.ACCESS_TOKEN_EXPIRATION ?? '15m';
process.env.REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? 'refresh_secret';
process.env.REFRESH_TOKEN_EXPIRATION =
  process.env.REFRESH_TOKEN_EXPIRATION ?? '7d';

// MailConfig required vars (tests don't send emails but config validation runs)
process.env.SMTP_FROM = process.env.SMTP_FROM ?? 'test@example.com';
process.env.SMTP_HOST = process.env.SMTP_HOST ?? 'localhost';
process.env.SMTP_PASS = process.env.SMTP_PASS ?? 'test';
process.env.SMTP_PORT = process.env.SMTP_PORT ?? '2525';
process.env.SMTP_USER = process.env.SMTP_USER ?? 'test';
process.env.EMAIL_VERIFICATION_URL =
  process.env.EMAIL_VERIFICATION_URL ?? 'http://localhost/verify';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/infrastructure/database/prisma.service';
import { MailService } from '../src/shared/infrastructure/mail/mail.service';

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
    const prismaMock: any = {
        $connect: () => Promise.resolve(),
        $disconnect: () => Promise.resolve(),
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest
            .fn()
            .mockRejectedValue(new Error('Not implemented in test')),
        },
    };
    prismaMock.$transaction = jest.fn().mockImplementation((cb: any) => cb(prismaMock));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(MailService)
      .useValue({
        sendVerifyEmail: jest.fn().mockResolvedValue(undefined),
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
