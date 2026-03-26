import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CreateVacancyDto, UpdateVacancyDto } from './dto';
import { VacanciesService } from './vacancies.service';

@Controller('v1/vacancies')
export class VacanciesControllerV1 {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  create(@Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(dto);
  }

  @Get()
  findAll() {
    return this.vacanciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }
  @Patch(':id')
  udate(@Param('id') id: string, @Body() dto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(id);
  }
}
