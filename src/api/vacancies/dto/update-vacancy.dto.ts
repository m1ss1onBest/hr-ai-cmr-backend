import { PartialType } from '@nestjs/swagger';
import { CreateVacancyRequest } from './create-vacancy.dto';
import { VacancyBaseResponse } from './vacancy.base-response';

export class UpdateVacancyRequest extends PartialType(CreateVacancyRequest) {}

export class UpdateVacancyResponse extends VacancyBaseResponse {}
