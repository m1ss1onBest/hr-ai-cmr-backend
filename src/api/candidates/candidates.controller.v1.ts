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
  Patch,
  Req,
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
import { IAnalyzeResumeUseCase } from './use-cases/analyze-resume/analyze-resume.interface';
import {
  AnalyzeResumeRequest,
  ResumeAnalysisResponse,
} from './dto/analyze-resume.dto';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/modules/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/modules/guards/roles.guard';
import { Roles } from '../auth/modules/guards/roles.decorator';
import { UserRole } from 'prisma/generated/enums';
import { Request } from 'express';
import { UpdateCandidateStatusRequest } from './dto/update.candidate-status.dto';
import { IUpdateCandidateStatusUseCase } from './use-cases/update-candidate-status/update-candidate-status.interface';
import {
  CandidateCommentResponse,
  CreateCandidateCommentRequest,
  UpdateCandidateCommentRequest,
} from './dto/comments.dto';
import { IAddCommentUseCase } from './use-cases/comments/add-comment/add-comment.interface';
import { IGetCandidateCommentsUseCase } from './use-cases/comments/get-comments/get-comments.interface';
import { IUpdateCommentUseCase } from './use-cases/comments/update-comment/update-comment.interface';
import { IDeleteCommentUseCase } from './use-cases/comments/delete-comment/delete-comment.interface';

@Controller({
  version: '1',
  path: 'candidates',
})
@UseGuards(
  JwtAuthGuard as unknown as new (...args: any[]) => any,
  RolesGuard as unknown as new (...args: any[]) => any,
)
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
    private readonly analyzeResume: IAnalyzeResumeUseCase,
    @Inject(IUpdateCandidateStatusUseCase)
    private readonly updateCandidateStatus: IBaseUseCase<
      { id: string; status: string; changedById: string },
      CandidateBaseResponse
    >,
    @Inject(IAddCommentUseCase)
    private readonly addComment: IBaseUseCase<
      { candidateId: string; authorId: string; text: string },
      CandidateCommentResponse
    >,
    @Inject(
      IGetCandidateCommentsUseCase as unknown as new (...args: any[]) => any,
    )
    private readonly getComments: IBaseUseCase<
      { candidateId: string },
      CandidateCommentResponse[]
    >,
    @Inject(IUpdateCommentUseCase as unknown as new (...args: any[]) => any)
    private readonly updateComment: IBaseUseCase<
      {
        candidateId: string;
        commentId: string;
        authorId: string;
        text: string;
      },
      CandidateCommentResponse
    >,
    @Inject(IDeleteCommentUseCase as unknown as new (...args: any[]) => any)
    private readonly deleteComment: IBaseUseCase<
      { candidateId: string; commentId: string; authorId: string },
      void
    >,
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

  @Post(':id/analyze-resume')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Resume analyzed successfully',
    type: ResumeAnalysisResponse,
  })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  @ApiResponse({ status: 408, description: 'AI request timed out' })
  @ApiResponse({ status: 429, description: 'AI rate limit exceeded' })
  @ApiResponse({ status: 503, description: 'AI service unavailable' })
  async analyzeResumeForCandidate(
    @Param('id') id: string,
    @Body() request: AnalyzeResumeRequest,
  ): Promise<ResumeAnalysisResponse> {
    return await this.analyzeResume.run({ candidateId: id, ...request });
  }

  @Patch(':id/status')
  @Roles(UserRole.HR)
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Candidate status updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCandidateStatusRequest,
    @Req() req: Request,
  ): Promise<CandidateBaseResponse> {
    const user = req['_user'] as { id: string };
    return await this.updateCandidateStatus.run({
      id,
      status: dto.status,
      changedById: user.id,
    });
  }

  @Post(':id/comments')
  @Roles(UserRole.HR)
  @HttpCode(201)
  async addCandidateComment(
    @Param('id') candidateId: string,
    @Body() dto: CreateCandidateCommentRequest,
    @Req() req: Request,
  ): Promise<CandidateCommentResponse> {
    const user = req['_user'] as { id: string };
    return await this.addComment.run({
      candidateId,
      authorId: user.id,
      text: dto.text,
    });
  }

  @Get(':id/comments')
  @HttpCode(200)
  async getCandidateComments(
    @Param('id') candidateId: string,
  ): Promise<CandidateCommentResponse[]> {
    return await this.getComments.run({ candidateId });
  }

  @Put(':id/comments/:commentId')
  @Roles(UserRole.HR)
  @HttpCode(200)
  async updateCandidateComment(
    @Param('id') candidateId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCandidateCommentRequest,
    @Req() req: Request,
  ): Promise<CandidateCommentResponse> {
    const user = req['_user'] as { id: string };
    return await this.updateComment.run({
      candidateId,
      commentId,
      authorId: user.id,
      text: dto.text,
    });
  }

  @Delete(':id/comments/:commentId')
  @Roles(UserRole.HR)
  @HttpCode(204)
  async deleteCandidateComment(
    @Param('id') candidateId: string,
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ): Promise<void> {
    const user = req['_user'] as { id: string };
    await this.deleteComment.run({ candidateId, commentId, authorId: user.id });
  }
}

/**
 * Backward-compatible alias routes without URI version prefix.
 * With global prefix `api`, this exposes: /api/candidates
 */
@Controller({
  path: 'candidates',
})
@UseGuards(
  JwtAuthGuard as unknown as new (...args: any[]) => any,
  RolesGuard as unknown as new (...args: any[]) => any,
)
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
    private readonly analyzeResume: IAnalyzeResumeUseCase,
    @Inject(IUpdateCandidateStatusUseCase)
    private readonly updateCandidateStatus: IBaseUseCase<
      { id: string; status: string; changedById: string },
      CandidateBaseResponse
    >,
    @Inject(IAddCommentUseCase)
    private readonly addComment: IBaseUseCase<
      { candidateId: string; authorId: string; text: string },
      CandidateCommentResponse
    >,
    @Inject(
      IGetCandidateCommentsUseCase as unknown as new (...args: any[]) => any,
    )
    private readonly getComments: IBaseUseCase<
      { candidateId: string },
      CandidateCommentResponse[]
    >,
    @Inject(IUpdateCommentUseCase as unknown as new (...args: any[]) => any)
    private readonly updateComment: IBaseUseCase<
      {
        candidateId: string;
        commentId: string;
        authorId: string;
        text: string;
      },
      CandidateCommentResponse
    >,
    @Inject(IDeleteCommentUseCase as unknown as new (...args: any[]) => any)
    private readonly deleteComment: IBaseUseCase<
      { candidateId: string; commentId: string; authorId: string },
      void
    >,
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

  @Post(':id/analyze-resume')
  @HttpCode(200)
  async analyzeResumeForCandidate(
    @Param('id') id: string,
    @Body() request: AnalyzeResumeRequest,
  ): Promise<ResumeAnalysisResponse> {
    return await this.analyzeResume.run({ candidateId: id, ...request });
  }

  @Patch(':id/status')
  @Roles(UserRole.HR)
  @HttpCode(200)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCandidateStatusRequest,
    @Req() req: Request,
  ): Promise<CandidateBaseResponse> {
    const user = req['_user'] as { id: string };
    return await this.updateCandidateStatus.run({
      id,
      status: dto.status,
      changedById: user.id,
    });
  }

  @Post(':id/comments')
  @Roles(UserRole.HR)
  @HttpCode(201)
  async addCandidateComment(
    @Param('id') candidateId: string,
    @Body() dto: CreateCandidateCommentRequest,
    @Req() req: Request,
  ): Promise<CandidateCommentResponse> {
    const user = req['_user'] as { id: string };
    return await this.addComment.run({
      candidateId,
      authorId: user.id,
      text: dto.text,
    });
  }

  @Get(':id/comments')
  @HttpCode(200)
  async getCandidateComments(
    @Param('id') candidateId: string,
  ): Promise<CandidateCommentResponse[]> {
    return await this.getComments.run({ candidateId });
  }

  @Put(':id/comments/:commentId')
  @Roles(UserRole.HR)
  @HttpCode(200)
  async updateCandidateComment(
    @Param('id') candidateId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCandidateCommentRequest,
    @Req() req: Request,
  ): Promise<CandidateCommentResponse> {
    const user = req['_user'] as { id: string };
    return await this.updateComment.run({
      candidateId,
      commentId,
      authorId: user.id,
      text: dto.text,
    });
  }

  @Delete(':id/comments/:commentId')
  @Roles(UserRole.HR)
  @HttpCode(204)
  async deleteCandidateComment(
    @Param('id') candidateId: string,
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ): Promise<void> {
    const user = req['_user'] as { id: string };
    await this.deleteComment.run({ candidateId, commentId, authorId: user.id });
  }
}
