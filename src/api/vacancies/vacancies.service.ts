import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVacancyDto, UpdateVacancyDto } from './dto';
import { VacansiesRepository } from 'src/shared/infrastructure/database/repositories/vacancies.repository';
@Injectable()
export class VacanciesService {
  constructor(private readonly vacanciesRepo: VacansiesRepository) {}
  async create(dto: CreateVacancyDto) {
    return await this.vacanciesRepo.create(dto);
  }

  async findAll() {
    return await this.vacanciesRepo.findAll();
  }

  async findOne(id: string) {
    const vacancy = await this.vacanciesRepo.findOneById(id);
    if (!vacancy) throw new NotFoundException(`Vacancy ${id} not found`);
    return vacancy;
  }

  async update(id: string, dto: UpdateVacancyDto) {
    await this.findOne(id);
    return await this.vacanciesRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.vacanciesRepo.remove(id);
  }
}
