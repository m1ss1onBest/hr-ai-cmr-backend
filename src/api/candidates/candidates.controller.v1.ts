import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CandidateBaseResponse } from './dto/candidate.base-response';
import { IGetCandidateUseCase } from './use-cases/get-candidate/get-candidate.interface';
import {
  CreateCandidateRequest,
  CreateCandidateResponse,
} from './dto/create.candidate.dto';
import { ICreateCandidateUseCase } from './use-cases/create/create-candidate.interface';
import {
  SearchCandidatesPaginatedResponse,
  SearchCandidatesQuery,
} from './dto/search.candidates.dto';
import { ISearchCandidatesUseCase } from './use-cases/search-candidates/search-candiadtes.interface';
import {
  UpdateCandidateRequest,
  UpdateCandidateResponse,
} from './dto/update.candidate.dto';
import { IUpdateCandidateUseCase } from './use-cases/update-candidate/update-candidate.interface';
import { IDeleteCandidateUseCase } from './use-cases/delete-candidate/delete-candidate.interface';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/modules/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/modules/guards/roles.guard';
import { Roles } from '../auth/modules/guards/roles.decorator';
import { UserRole } from 'prisma/generated/enums';

@Controller({
  version: '1',
  path: 'candidates',
})
@UseGuards(JwtAuthGuard as unknown as new (...args: any[]) => any, RolesGuard as unknown as new (...args: any[]) => any)
@ApiBearerAuth()
export class CandidatesControllerV1 {
  constructor(
    private readonly getCandidate: IGetCandidateUseCase,
    private readonly createCandidate: ICreateCandidateUseCase,
    private readonly searchCandidates: ISearchCandidatesUseCase,
    @Inject(IUpdateCandidateUseCase)
    private readonly updateCandidate: IBaseUseCase<
      UpdateCandidateRequest & { id: string },
      UpdateCandidateResponse
    >,
    @Inject(IDeleteCandidateUseCase)
    private readonly deleteCandidate: IBaseUseCase<{ id: string }, unknown>,
  ) {}

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Candidate found',
    type: CandidateBaseResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Candidate not found',
  })
  async getOneById(@Param('id') id: string): Promise<CandidateBaseResponse> {
    return await this.getCandidate.run(id);
  }

  @Get()
  @HttpCode(200)
  async getCandidates(
    @Query() query: SearchCandidatesQuery,
  ): Promise<SearchCandidatesPaginatedResponse> {
    return await this.searchCandidates.run(query);
  }

  @Post()
  @Roles(UserRole.HR)
  @HttpCode(201)
  async create(
    @Body() request: CreateCandidateRequest,
  ): Promise<CreateCandidateResponse> {
    return await this.createCandidate.run(request);
  }

  @Put(':id')
  @Roles(UserRole.HR)
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Candidate updated' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  async update(
    @Param('id') id: string,
    @Body() request: UpdateCandidateRequest,
  ): Promise<UpdateCandidateResponse> {
    return await this.updateCandidate.run({ id, ...request });
  }

  @Delete(':id')
  @Roles(UserRole.HR)
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Candidate deleted (soft)' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCandidate.run({ id });
  }
}

/**
 * Backward-compatible alias routes without URI version prefix.
 * With global prefix `api`, this exposes: /api/candidates
 */
@Controller({
  path: 'candidates',
})
@UseGuards(JwtAuthGuard as unknown as new (...args: any[]) => any, RolesGuard as unknown as new (...args: any[]) => any)
@ApiBearerAuth()
export class CandidatesController {
  constructor(
    private readonly getCandidate: IGetCandidateUseCase,
    private readonly createCandidate: ICreateCandidateUseCase,
    private readonly searchCandidates: ISearchCandidatesUseCase,
    @Inject(IUpdateCandidateUseCase)
    private readonly updateCandidate: IBaseUseCase<
      UpdateCandidateRequest & { id: string },
      UpdateCandidateResponse
    >,
    @Inject(IDeleteCandidateUseCase)
    private readonly deleteCandidate: IBaseUseCase<{ id: string }, unknown>,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') id: string): Promise<CandidateBaseResponse> {
    return await this.getCandidate.run(id);
  }

  @Get()
  @HttpCode(200)
  async getCandidates(
    @Query() query: SearchCandidatesQuery,
  ): Promise<SearchCandidatesPaginatedResponse> {
    return await this.searchCandidates.run(query);
  }

  @Post()
  @Roles(UserRole.HR)
  @HttpCode(201)
  async create(
    @Body() request: CreateCandidateRequest,
  ): Promise<CreateCandidateResponse> {
    return await this.createCandidate.run(request);
  }

  @Put(':id')
  @Roles(UserRole.HR)
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() request: UpdateCandidateRequest,
  ): Promise<UpdateCandidateResponse> {
    return await this.updateCandidate.run({ id, ...request });
  }

  @Delete(':id')
  @Roles(UserRole.HR)
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCandidate.run({ id });
  }
}
