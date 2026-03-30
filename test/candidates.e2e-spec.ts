process.env.ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? 'access_secret';
process.env.ACCESS_TOKEN_EXPIRATION =
  process.env.ACCESS_TOKEN_EXPIRATION ?? '15m';
process.env.REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? 'refresh_secret';
process.env.REFRESH_TOKEN_EXPIRATION =
  process.env.REFRESH_TOKEN_EXPIRATION ?? '7d';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/infrastructure/database/prisma.service';

describe('Candidates (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: () => Promise.resolve(),
        $disconnect: () => Promise.resolve(),
        $queryRaw: () => Promise.resolve(1),
        candidate: {
          create: jest.fn(),
          findUnique: jest.fn(),
          findMany: jest.fn(),
          count: jest.fn(),
          update: jest.fn(),
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

  it('POST /api/v1/candidates -> 401 without token', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/candidates')
      .send({
        name: 'John Doe',
        cvUrl: 'https://example.com/cv.pdf',
        expectedSalary: '1500 USD',
        position: 'Frontend Developer',
      })
      .expect(401);
  });
});
