import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export abstract class IBaseUserRepository {
  constructor(protected readonly prisma: PrismaService) {}
}
