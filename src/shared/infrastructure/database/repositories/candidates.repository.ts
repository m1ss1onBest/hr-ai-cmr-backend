import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBaseUserRepository as IBaseRepository } from '../../../contracts/use-cases/base.repository';
import { Candidate as CandidateModel, Prisma } from 'prisma/generated/client';
import { CreateCandidateRequest } from 'src/api/candidates/dto/create.candidate.dto';
import { SearchCandidatesQuery } from 'src/api/candidates/dto/search.candidates.dto';
import { PaginatedResponse } from 'src/shared/contracts/dto/pagination.dto';
import * as crypto from 'crypto';
import { CandidateStatus } from 'prisma/generated/enums';

export type UpdateCandidateRequest = Partial<
  Pick<
    CreateCandidateRequest,
    | 'name'
    | 'email'
    | 'phone'
    | 'linkedInUrl'
    | 'comment'
    | 'expectedSalary'
    | 'cvUrl'
    | 'position'
  >
>;

@Injectable()
export class CandidatesRepository extends IBaseRepository {
  async findOneById(id: string): Promise<CandidateModel | null> {
    return await this.prisma.candidate.findUnique({
      where: { id, deletedAt: null },
    });
  }

  private async getOrCreatePositionIdByName(name: string): Promise<string> {
    const existing = await this.prisma.position.findUnique({
      where: { name },
    });
    if (existing) return existing.id;

    const created = await this.prisma.position.create({
      data: {
        id: crypto.randomUUID(),
        name,
      },
    });
    return created.id;
  }

  async findOneByEmail(email: string): Promise<CandidateModel | null> {
    return await this.prisma.candidate.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async create(request: CreateCandidateRequest): Promise<CandidateModel> {
    const existingByEmail = await this.findOneByEmail(request.email);
    if (existingByEmail) {
      throw new ConflictException('Candidate with this email already exists');
    }

    const positionId = await this.getOrCreatePositionIdByName(request.position);

    const now = new Date();
    const candidateId = crypto.randomUUID();
    const initialStatus = (request as any).status ?? CandidateStatus.NEW;

    const tx: any[] = [
      this.prisma.candidate.create({
        data: {
          id: candidateId,
          name: request.name,
          email: request.email,
          positionId,
          ...(request.phone ? { phone: request.phone } : {}),
          ...(request.linkedInUrl ? { linkedInUrl: request.linkedInUrl } : {}),
          ...(request.comment ? { comment: request.comment } : {}),
          ...(request.expectedSalary
            ? { expectedSalary: request.expectedSalary }
            : {}),
          ...(request.cvUrl ? { cvUrl: request.cvUrl } : {}),
          createdAt: now,
          updatedAt: now,
        },
      }),
    ];

    if (request.createdById) {
      tx.push(
        this.prisma.statusHistory.create({
          data: {
            id: crypto.randomUUID(),
            candidateId,
            status: initialStatus,
            changedById: request.createdById,
            createdAt: now,
          },
        }),
      );
    }

    const [candidate] = await this.prisma.$transaction(tx);
    return candidate;
  }

  async update(
    id: string,
    data: UpdateCandidateRequest,
  ): Promise<CandidateModel> {
    const existing = await this.findOneById(id);
    if (!existing) throw new NotFoundException('Candidate');

    if (data.email && data.email !== existing.email) {
      const byEmail = await this.findOneByEmail(data.email);
      if (byEmail && byEmail.id !== id) {
        throw new ConflictException('Candidate with this email already exists');
      }
    }

    const { position, ...rest } = data;
    const positionId = position
      ? await this.getOrCreatePositionIdByName(position)
      : undefined;

    return await this.prisma.candidate.update({
      where: { id },
      data: {
        ...rest,
        ...(positionId ? { positionId } : {}),
      },
    });
  }

  async setCvUrl(id: string, fileUrl): Promise<CandidateModel | undefined> {
    const existing = await this.findOneById(id);
    if (!existing) {
      return undefined;
    }

    return await this.prisma.candidate.update({
      where: { id },
      data: {
        cvUrl: fileUrl,
      },
    });
  }

  async softDelete(id: string): Promise<CandidateModel> {
    const existing = await this.findOneById(id);
    if (!existing) throw new NotFoundException(`Candidate ${id} was not found`);

    return await this.prisma.candidate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findOneByIdWithCurrentStatus(
    id: string,
  ): Promise<(CandidateModel & { currentStatus?: CandidateStatus }) | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id, deletedAt: null },
      include: {
        statusHistories: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { status: true },
        },
      },
    });

    if (!candidate) return null;

    const last = candidate.statusHistories?.[0]?.status;

    // Strip relation field from response shape
    const base = { ...(candidate as any) };
    delete (base as any).statusHistories;

    return {
      ...(base as CandidateModel),
      currentStatus: last ?? CandidateStatus.NEW,
    };
  }

  async searchManyWithCurrentStatus(
    searchQuery: SearchCandidatesQuery,
  ): Promise<
    PaginatedResponse<CandidateModel & { currentStatus?: CandidateStatus }>
  > {
    const page = searchQuery.page ?? 1;
    const limit = searchQuery.limit ?? 20;

    const sortBy = searchQuery.sortBy ?? 'createdAt';
    const order = searchQuery.order ?? 'desc';

    const where: Prisma.CandidateWhereInput = {
      deletedAt: null,
    };

    if (searchQuery.position?.length) {
      where.Position = {
        is: {
          name: { in: searchQuery.position },
        },
      };
    }

    if (searchQuery.search) {
      where.OR = [
        { name: { contains: searchQuery.search, mode: 'insensitive' } },
      ];
    }

    if (searchQuery.createdAfter || searchQuery.createdBefore) {
      where.createdAt = {
        gte: searchQuery.createdAfter,
        lte: searchQuery.createdBefore,
      };
    }

    const queryBuilder: Prisma.CandidateFindManyArgs = {
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        statusHistories: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { status: true },
        },
      },
    };

    const [data, total] = await Promise.all([
      this.prisma.candidate.findMany(queryBuilder),
      this.prisma.candidate.count({ where: queryBuilder.where }),
    ]);

    const mapped = data.map((c) => {
      const anyC = c as any;
      const last = anyC.statusHistories?.[0]?.status;
      const base = { ...(anyC as any) };
      delete (base as any).statusHistories;

      return {
        ...(base as CandidateModel),
        currentStatus: last ?? CandidateStatus.NEW,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: mapped,
      meta: {
        total,
        page,
        pageSize: limit,
        totalPages,
      },
    };
  }

  async updateStatusWithHistory(params: {
    candidateId: string;
    status: CandidateStatus;
    changedById: string;
    applicationId?: string;
  }): Promise<CandidateModel> {
    const existing = await this.findOneById(params.candidateId);
    if (!existing) throw new NotFoundException('Candidate');

    const now = new Date();

    const [candidate] = await this.prisma.$transaction([
      // Old behavior: status is stored in StatusHistory; candidate row only touches updatedAt.
      this.prisma.candidate.update({
        where: { id: params.candidateId },
        data: { updatedAt: now },
      }),
      this.prisma.statusHistory.create({
        data: {
          id: crypto.randomUUID(),
          candidateId: params.candidateId,
          status: params.status,
          changedById: params.changedById,
          applicationId: params.applicationId,
          createdAt: now,
        },
      }),
    ]);

    return candidate;
  }
}
