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
import { IJwtTokensService } from '../src/api/auth/modules/jwt/jwt.interface';

describe('Candidates status update (e2e)', () => {
  let app: INestApplication<App>;

  type PrismaMock = {
    $connect: () => Promise<void>;
    $disconnect: () => Promise<void>;
    $queryRaw: () => Promise<unknown>;
    $transaction: jest.Mock;
    candidate: {
      update: jest.Mock;
      findUnique: jest.Mock;
    };
    statusHistory: {
      create: jest.Mock;
    };
    user: {
      findUnique: jest.Mock;
    };
  };

  const getPrismaMock = () => app.get(PrismaService);

  const makeAuthHeader = async (userId: string) => {
    const jwt = app.get(IJwtTokensService);
    const token = await jwt.generateAccessToken({
      sub: userId,
      email: 'hr@example.com',
      role: 'HR',
    });
    return `Bearer ${token}`;
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: () => Promise.resolve(),
        $disconnect: () => Promise.resolve(),
        $queryRaw: () => Promise.resolve(1),
        $transaction: jest.fn(async (ops: unknown[]) => {
          // prisma.$transaction(arrayOfPromises) returns array of results
          return await Promise.all(ops as Promise<unknown>[]);
        }),
        candidate: {
          update: jest.fn(),
          findUnique: jest.fn(),
        },
        statusHistory: {
          create: jest.fn(),
        },
        user: {
          findUnique: jest.fn(),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  it('PATCH /api/v1/candidates/:id/status -> 400 for invalid status', async () => {
    const prisma = getPrismaMock();

    prisma.user.findUnique.mockResolvedValue({
      id: 'u_1',
      email: 'hr@example.com',
      password: 'hashed',
      role: 'HR',
      name: 'HR',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const auth = await makeAuthHeader('u_1');

    await request(app.getHttpServer())
      .patch('/api/v1/candidates/c_1/status')
      .set('Authorization', auth)
      .send({ status: 'WRONG' })
      .expect(400);
  });

  it('PATCH /api/v1/candidates/:id/status -> 200 updates candidate and writes StatusHistory in one transaction', async () => {
    const prisma = getPrismaMock();

    prisma.user.findUnique.mockResolvedValue({
      id: 'u_1',
      email: 'hr@example.com',
      password: 'hashed',
      role: 'HR',
      name: 'HR',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    prisma.candidate.findUnique.mockResolvedValue({
      id: 'c_1',
      name: 'John',
      email: 'john@example.com',
      phone: null,
      linkedInUrl: null,
      comment: null,
      cvUrl: null,
      expectedSalary: null,
      positionId: 'p_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const updatedCandidate = {
      id: 'c_1',
      name: 'John',
      email: 'john@example.com',
      phone: null,
      linkedInUrl: null,
      comment: null,
      cvUrl: null,
      expectedSalary: null,
      positionId: 'p_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    prisma.candidate.update.mockResolvedValue(updatedCandidate);
    prisma.statusHistory.create.mockResolvedValue({
      id: 'sh_1',
      candidateId: 'c_1',
      status: 'INTERVIEW',
      changedById: 'u_1',
      applicationId: null,
      createdAt: new Date(),
    });

    const auth = await makeAuthHeader('u_1');

    const res = await request(app.getHttpServer())
      .patch('/api/v1/candidates/c_1/status')
      .set('Authorization', auth)
      .send({ status: 'INTERVIEW' })
      .expect(200);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.statusHistory.create).toHaveBeenCalledTimes(1);

    expect(res.body).toMatchObject({
      id: 'c_1',
      email: 'john@example.com',
      currentStatus: 'INTERVIEW',
    });
  });

  it('PATCH /api/v1/candidates/:id/status -> 200 accepts TEST_TASK alias', async () => {
    const prisma = getPrismaMock();

    prisma.user.findUnique.mockResolvedValue({
      id: 'u_1',
      email: 'hr@example.com',
      password: 'hashed',
      role: 'HR',
      name: 'HR',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    prisma.candidate.findUnique.mockResolvedValue({
      id: 'c_1',
      name: 'John',
      email: 'john@example.com',
      phone: null,
      linkedInUrl: null,
      comment: null,
      cvUrl: null,
      expectedSalary: null,
      positionId: 'p_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    prisma.candidate.update.mockResolvedValue({
      id: 'c_1',
      name: 'John',
      email: 'john@example.com',
      phone: null,
      linkedInUrl: null,
      comment: null,
      cvUrl: null,
      expectedSalary: null,
      positionId: 'p_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    prisma.statusHistory.create.mockResolvedValue({
      id: 'sh_1',
      candidateId: 'c_1',
      status: 'TEST_TALK',
      changedById: 'u_1',
      applicationId: null,
      createdAt: new Date(),
    });

    const auth = await makeAuthHeader('u_1');

    const res = await request(app.getHttpServer())
      .patch('/api/v1/candidates/c_1/status')
      .set('Authorization', auth)
      .send({ status: 'TEST_TASK' })
      .expect(200);

    // response normalizes to the internal enum value
    expect(res.body).toMatchObject({ currentStatus: 'TEST_TALK' });
  });
});
