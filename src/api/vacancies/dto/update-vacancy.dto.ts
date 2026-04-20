import { PartialType } from '@nestjs/swagger';
import { CreateVacancyRequest } from './create-vacancy.dto';
import { VacancyBaseResponse } from './vacancy.base-response';

export class UpdateVacancyRequest extends PartialType(CreateVacancyRequest) {
/*
    @ApiProperty({
        description: 'Vacancy id',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;
*/
}

export class UpdateVacancyResponse extends VacancyBaseResponse {}
