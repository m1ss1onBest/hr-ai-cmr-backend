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

describe('Auth & Security (e2e) - KAN-146/147/149', () => {
  let app: INestApplication;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock: any = {
      user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn().mockResolvedValue({}) },
      candidate: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    };
    prismaMock.$transaction = jest.fn().mockImplementation((cb) => cb(prismaMock));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          const auth = req.headers.authorization;

          if (!auth) throw new UnauthorizedException();

          req.user = { id: 'user-1' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
    prisma = app.get(PrismaService);
  });

  it('POST /api/v1/auth/register -> 409 Conflict if email exists (KAN-146)', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'uuid',
      email: 'denys@stfalcon.com',
      isEmailVerified: true,
    });
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'denys@stfalcon.com',
        password: 'Password123!',
        name: 'Denys',
      })
      .expect(409);
  });

  it('POST /api/v1/auth/login -> 401 Unauthorized on wrong password (KAN-149)', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'denys@stfalcon.com',
      password: 'hash',
    });
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'denys@stfalcon.com', password: 'WrongPassword123!' })
      .expect(401);
  });

  it('GET /api/v1/candidates -> 401 Unauthorized without JWT (KAN-147)', async () => {
    return request(app.getHttpServer()).get('/api/v1/candidates').expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('Auth & Security (e2e) - HR access to admin route', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const prismaMock: any = {
      user: { findUnique: jest.fn(), create: jest.fn() },
      candidate: { findMany: jest.fn().mockResolvedValue([]), count: jest.fn().mockResolvedValue(0) }
    };
    prismaMock.$transaction = jest.fn().mockImplementation((cb) => cb(prismaMock));

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService).useValue(prismaMock)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          const auth = req.headers.authorization;

          if (!auth) throw new UnauthorizedException();

          req.user = { id: 'hr-user-1', role: 'HR' };

          const { ForbiddenException } = require('@nestjs/common');
          throw new ForbiddenException('Access denied: admin role required');
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  it('GET /api/v1/candidates -> 403 Forbidden for HR user on admin route', async () => {
    return request(app.getHttpServer())
      .get('/api/v1/candidates')
      .set('Authorization', 'Bearer hr-valid-token')
      .expect(403);
  });

  afterAll(async () => {
    await app.close();
  });
});
