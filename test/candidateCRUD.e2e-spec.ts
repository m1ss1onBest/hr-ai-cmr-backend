import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/infrastructure/database/prisma.service';
import { JwtAuthGuard } from '../src/api/auth/modules/guards/jwt-auth.guard'; 

describe('Candidates (e2e)- CRUD/Soft Delete/Search/Filter-sort/Validation', () => {
  let app: INestApplication<App>;
  let prisma: any;

  const candidateId = '9638c4b1-e737-4d94-9189-63a936a2818d';
  const positionUuid = 'c0a80121-7ac0-11ed-a1eb-0242ac120002';

  const validCandidateData = {
    name: 'Denys Sh',
    cvUrl: 'https://example.com/cv.pdf',
    expectedSalary: '2000 USD',
    position: positionUuid, 
  };

  beforeEach(async () => {
    const prismaMock = {
      candidate: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
      user: { findUnique: jest.fn() },
      position: { findUnique: jest.fn().mockResolvedValue({ id: positionUuid }) }
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) 
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.init();
    prisma = app.get(PrismaService);
  });

  it('POST /api/v1/candidates -> 201 Success (KAN-113)', async () => {
    prisma.candidate.create.mockResolvedValue({ id: candidateId, ...validCandidateData });
    
    return request(app.getHttpServer())
      .post('/api/v1/candidates')
      .send(validCandidateData)
      .expect(201);
  });

  it('POST /api/v1/candidates -> 400 Missing required fields (KAN-114)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/candidates')
      .send({}) 
      .expect(400);

    expect(response.body.message).toContain('position should not be empty');
    expect(response.body.message).toContain('cvUrl must be a URL address'); 
    expect(response.body.message).toContain('expectedSalary should not be empty');
  });

  it('DELETE /api/v1/candidates/:id -> 204 Soft Delete (KAN-115)', async () => {
    prisma.candidate.findUnique.mockResolvedValue({ id: candidateId });
    prisma.candidate.update.mockResolvedValue({ id: candidateId, deletedAt: new Date() });

    return request(app.getHttpServer())
      .delete(`/api/v1/candidates/${candidateId}`)
      .expect(204);
  });

  it('GET /api/v1/candidates -> 200 Search and Filter (KAN-116, KAN-118)', async () => {
    prisma.candidate.findMany.mockResolvedValue([{ id: candidateId, ...validCandidateData }]);
    prisma.candidate.count.mockResolvedValue(1);

    return request(app.getHttpServer())
      .get('/api/v1/candidates')
      .query({ search: 'Denys', positionId: positionUuid })
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('POST /api/v1/candidates -> 400 Incorrect file format/URL (KAN-117)', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/candidates')
      .send({
        ...validCandidateData,
        cvUrl: 'not-a-valid-url' 
      })
      .expect(400);
  });

  it('POST /api/v1/candidates -> 400 Data too long', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/candidates')
      .send({
        ...validCandidateData,
        name: 'a'.repeat(256) 
      })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});