import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import {
  CreateVacancyRequest,
  CreateVacancyResponse,
  UpdateVacancyRequest,
  UpdateVacancyResponse,
  VacancyBaseResponse,
} from './dto';
import { ICreateVacancyUseCase } from './use-cases/create-vacancy/create-vacancy.interface';
import { IGetVacancyUseCase } from './use-cases/get-vacancy/get-vacancy.interface';
import { IGetAllVacanciesUseCase } from './use-cases/get-all-vacancies/get-all-vacancies.interface';
import { IUpdateVacancyUseCase } from './use-cases/update-vacancy/update-vacancy.interface';
import { IDeleteVacancyUseCase } from './use-cases/delete-vacancy/delete-vacancy.interface';
import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { JwtAuthGuard } from '../auth/modules/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/modules/guards/roles.guard';
import { Roles } from '../auth/modules/guards/roles.decorator';
import { UserRole } from 'prisma/generated/enums';

@Controller({
  version: '1',
  path: 'vacancies',
})
@UseGuards(
  JwtAuthGuard as unknown as new (...args: any[]) => any,
  RolesGuard as unknown as new (...args: any[]) => any,
)
@ApiBearerAuth()
export class VacanciesControllerV1 {
  constructor(
    private readonly createVacancy: ICreateVacancyUseCase,
    private readonly getVacancy: IGetVacancyUseCase,
    private readonly getAllVacancies: IGetAllVacanciesUseCase,
    @Inject(IUpdateVacancyUseCase)
    private readonly updateVacancy: IBaseUseCase<
      UpdateVacancyRequest & { id: string },
      UpdateVacancyResponse
    >,
    @Inject(IDeleteVacancyUseCase)
    private readonly deleteVacancy: IBaseUseCase<{ id: string }, unknown>,
  ) {}

  @Post()
  @Roles(UserRole.HR)
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Vacancy created', type: CreateVacancyResponse })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreateVacancyRequest,
    @Req() req: Request,
  ): Promise<CreateVacancyResponse> {
    const user = req['_user'] as { id: string };
    return await this.createVacancy.run({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'List of vacancies', type: [VacancyBaseResponse] })
  async findAll(): Promise<VacancyBaseResponse[]> {
    return await this.getAllVacancies.run();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Vacancy found', type: VacancyBaseResponse })
  @ApiResponse({ status: 404, description: 'Vacancy not found' })
  async findOne(@Param('id') id: string): Promise<VacancyBaseResponse> {
    return await this.getVacancy.run(id);
  }

  @Put(':id')
  @Roles(UserRole.HR)
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Vacancy updated', type: UpdateVacancyResponse })
  @ApiResponse({ status: 404, description: 'Vacancy not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVacancyRequest,
  ): Promise<UpdateVacancyResponse> {
    return await this.updateVacancy.run({ id, ...dto });
  }

  @Delete(':id')
  @Roles(UserRole.HR)
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Vacancy deleted (soft)' })
  @ApiResponse({ status: 404, description: 'Vacancy not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteVacancy.run({ id });
  }
}
