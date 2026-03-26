import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/infrastructure/database/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: () => Promise.resolve(),
        $disconnect: () => Promise.resolve(),
        user: {
          findUnique: () => Promise.resolve(null),
          create: () => Promise.reject(new Error('Not implemented in test')),
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

    // Override with a user that exists, but has a different password hash
    const existingUser = {
      id: 'u_1',
      email: 'user@example.com',
      password: await bcrypt.default.hash('correct-password', 10),
      role: 'HR',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const prisma = app.get(PrismaService);
    (prisma.user.findUnique as any) = () => Promise.resolve(existingUser);

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'wrong-password' })
      .expect(401);
  });

  it('/api/auth/register (POST) -> 201 and passes name to DB create', async () => {
    const prisma = app.get(PrismaService);

    const createSpy = jest.fn().mockResolvedValue({
      id: 'u_1',
      email: 'new@example.com',
      name: 'Іван',
      password: 'hashed',
      role: 'HR',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    (prisma.user.findUnique as any) = () => Promise.resolve(null);
    (prisma.user.create as any) = createSpy;

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ name: 'Іван', email: 'new@example.com', password: 'password123' })
      .expect(201);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Іван',
          email: 'new@example.com',
        }),
      }),
    );
  });
});
