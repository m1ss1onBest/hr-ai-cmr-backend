import { Injectable } from '@nestjs/common';
import { IBaseUserRepository as IBaseRepository } from '../../../contracts/use-cases/base.repository';
import { Candidate as CandidateModel, Prisma } from 'prisma/generated/client';
import { CreateCandidateRequest } from 'src/api/candidates/dto/create.candidate.dto';
import { SearchCandidatesQuery } from 'src/api/candidates/dto/search.candidates.dto';
import { PaginatedResponse } from 'src/shared/contracts/dto/pagination.dto';

@Injectable()
export class CandidatesRepository extends IBaseRepository {
  async findOneById(id: string): Promise<CandidateModel | null> {
    return await this.prisma.candidate.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async create(request: CreateCandidateRequest): Promise<CandidateModel> {
    return await this.prisma.candidate.create({
      data: {
        name: request.name,
        position: request.position,
        expectedSalary: request.expectedSalary,
        cvUrl: request.cvUrl,
      },
    });
  }

  async searchMany(
    searchQuery: SearchCandidatesQuery,
  ): Promise<PaginatedResponse<CandidateModel>> {
    const { page, pageSize } = searchQuery;

    const queryBuilder: Prisma.CandidateFindManyArgs = {
      where: {},
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    };

    if (searchQuery.status?.length) {
      queryBuilder.where!.currentStatus = { in: searchQuery.status };
    }

    const searchData = await this.prisma.candidate.findMany(queryBuilder);
    const total = await this.prisma.candidate.count({
      where: queryBuilder.where,
    });
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: searchData,
      meta: {
        total,
        page: searchQuery.page,
        pageSize: searchQuery.pageSize,
        totalPages,
      },
    };
  }
}
