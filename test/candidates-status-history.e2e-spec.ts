jest.mock('file-type', () => ({
  fileTypeFromBuffer: jest.fn().mockResolvedValue({ mime: 'application/pdf', ext: 'pdf' }),
}), { virtual: true });

process.env.GEMINI_API_KEY = 'test_key';

import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/infrastructure/database/prisma.service';
import { JwtAuthGuard } from '../src/api/auth/modules/guards/jwt-auth.guard';
import { RedisService } from '../src/shared/infrastructure/redis/redis.service';
import { MinioService } from '../src/shared/infrastructure/storage/services/minio.service';

const HR_USER_ID = 'hr-user-uuid-001';
const CANDIDATE_ID = 'candidate-uuid-001';

describe('Candidates StatusHistory (e2e) - Integration', () => {
  let app: INestApplication;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      candidate: {
        findUnique: jest.fn().mockResolvedValue({ id: CANDIDATE_ID, positionId: 'pos-1', status: 'NEW' }),
        update: jest.fn().mockResolvedValue({ id: CANDIDATE_ID, status: 'INTERVIEW' }),
        findFirst: jest.fn().mockResolvedValue(null),
      },
      statusHistory: {
        create: jest.fn().mockResolvedValue({ id: 'hist-1' }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      $transaction: jest.fn(async (ops) => {
        return Array.isArray(ops) ? Promise.all(ops) : ops;
      }),
      position: {
        findUnique: jest.fn().mockResolvedValue({ id: 'pos-1', name: 'Dev' }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService).useValue(prismaMock)
      .overrideProvider(RedisService).useValue({
        onModuleInit: jest.fn().mockResolvedValue(true),
        getClient: jest.fn().mockReturnValue({ on: jest.fn(), get: jest.fn(), set: jest.fn() }),
      })
      .overrideProvider(MinioService).useValue({
        onModuleInit: jest.fn().mockResolvedValue(true),
      })
      .overrideGuard(JwtAuthGuard).useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();

          if (!req.headers.authorization) {
            throw new UnauthorizedException();
          }

          const mockUser = { id: HR_USER_ID, role: 'HR' };
          req.user = mockUser;
          req._user = mockUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('PATCH /api/v1/candidates/:id/status -> success (KAN-148)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/candidates/${CANDIDATE_ID}/status`)
      .set('Authorization', 'Bearer valid-token')
      .send({ status: 'INTERVIEW' });

    if (response.status === 500) {
      console.log('DEBUG 500 Error Body:', response.body);
    }

    expect(response.status).toBe(200);
    expect(prismaMock.$transaction).toHaveBeenCalled();
  });

  it('PATCH /api/v1/candidates/:id/status -> 401 Unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/candidates/${CANDIDATE_ID}/status`)
      .send({ status: 'HIRED' });

    expect(response.status).toBe(401);
  });

  it('PATCH /api/v1/candidates/:id/status -> 400 Bad Request', async () => {
    return request(app.getHttpServer())
      .patch(`/api/v1/candidates/${CANDIDATE_ID}/status`)
      .set('Authorization', 'Bearer valid-token')
      .send({ status: 'INVALID' })
      .expect(400);
  });
});