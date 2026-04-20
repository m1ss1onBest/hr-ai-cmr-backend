
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    quit: jest.fn().mockResolvedValue('OK'),
    status: 'ready',
  }));
}, { virtual: true });

jest.mock('file-type', () => ({
  fileTypeFromBuffer: jest.fn().mockResolvedValue({ mime: 'application/pdf', ext: 'pdf' }),
}), { virtual: true });

process.env.GEMINI_API_KEY = 'test_key';
process.env.ACCESS_TOKEN_SECRET = 'access_secret';
process.env.ACCESS_TOKEN_EXPIRATION = '15m';


import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/infrastructure/database/prisma.service';
import { IJwtTokensService } from '../src/api/auth/modules/jwt/jwt.interface';
import { RedisService } from '../src/shared/infrastructure/redis/redis.service';
import { MinioService } from '../src/shared/infrastructure/storage/services/minio.service';

describe('Board/Funnel (e2e)', () => {
  let app: INestApplication<App>;

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
      .overrideProvider(RedisService).useValue({
        onModuleInit: jest.fn().mockResolvedValue(true),
        getClient: jest.fn().mockReturnValue({ on: jest.fn(), get: jest.fn(), set: jest.fn() }),
      })
      .overrideProvider(MinioService).useValue({
        onModuleInit: jest.fn().mockResolvedValue(true),
      })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: () => Promise.resolve(),
        $disconnect: () => Promise.resolve(),
        $queryRaw: () => Promise.resolve(1),
        $transaction: jest.fn(async (ops: unknown[]) => {
          return await Promise.all(ops as Promise<unknown>[]);
        }),
        candidate: {
          update: jest.fn(),
          findUnique: jest.fn(),
          findMany: jest.fn(),
          count: jest.fn(),
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

  afterAll(async () => {
    if (app) await app.close();
  });

  it('PATCH /api/v1/candidates/:id/status -> 200 (Drag-and-drop scenario)', async () => {
    const prisma = getPrismaMock() as any;

    prisma.user.findUnique.mockResolvedValue({
      id: 'u_hr',
      email: 'hr@example.com',
      password: 'hashed',
      role: 'HR',
      name: 'HR User',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    prisma.candidate.findUnique.mockResolvedValue({
      id: 'c_1',
      name: 'John DragDrop',
      email: 'john.dragdrop@example.com',
      positionId: 'p_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    prisma.candidate.update.mockResolvedValue({
      id: 'c_1',
      name: 'John DragDrop',
      email: 'john.dragdrop@example.com',
      positionId: 'p_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    prisma.statusHistory.create.mockResolvedValue({
      id: 'sh_1',
      candidateId: 'c_1',
      status: 'INTERVIEW',
      changedById: 'u_hr',
      applicationId: null,
      createdAt: new Date(),
    });

    const auth = await makeAuthHeader('u_hr');

    const response = await request(app.getHttpServer())
      .patch('/api/v1/candidates/c_1/status')
      .set('Authorization', auth)
      .send({ status: 'INTERVIEW' })
      .expect(200);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.statusHistory.create).toHaveBeenCalledTimes(1);
    expect(prisma.statusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        candidateId: 'c_1',
        status: 'INTERVIEW',
        changedById: 'u_hr',
      }),
    });

    expect(response.body).toMatchObject({
      id: 'c_1',
      currentStatus: 'INTERVIEW',
    });
  });

  it('GET /api/v1/candidates -> 200 (Complex filters scenario)', async () => {
    const prisma = getPrismaMock() as any;

    prisma.user.findUnique.mockResolvedValue({
      id: 'u_hr',
      email: 'hr@example.com',
      password: 'hashed',
      role: 'HR',
      name: 'HR User',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const mockCandidates = [
      {
        id: 'c_2',
        name: 'Jane Filtered',
        email: 'jane@example.com',
        positionId: 'p_2',
        statusHistories: [{ status: 'INTERVIEW' }],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    prisma.candidate.findMany.mockResolvedValue(mockCandidates);
    prisma.candidate.count.mockResolvedValue(1);

    const auth = await makeAuthHeader('u_hr');

    const response = await request(app.getHttpServer())
      .get('/api/v1/candidates')
      .query({ search: 'Jane', status: 'INTERVIEW' })
      .set('Authorization', auth)
      .expect(200);

    expect(prisma.candidate.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          deletedAt: null,
          OR: [{ name: { contains: 'Jane', mode: 'insensitive' } }],
        }),
      }),
    );

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe('Jane Filtered');
  });
});
