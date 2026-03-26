import { PartialType } from '@nestjs/mapped-types';
import { CreateVacancyDto } from './create-vacancy.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {}
