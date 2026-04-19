import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VacancyBaseResponse } from './vacancy.base-response';
import { VacancyStatus } from 'src/shared/domain/vacancies/vacancy.entity';

export class CreateVacancyRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'Vacancy title (position name)',
    example: 'Senior Node.js Developer',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Vacancy description',
    example:
      'We are looking for an experienced backend developer to join our team...',
  })
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    required: false,
    description: 'Offered salary',
    example: '3000-3500 USD',
  })
  salaryRange?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Work mode',
    example: 'Remote',
  })
  workMode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Experience',
    example: '5',
  })
  experience?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Location',
    example: 'Kyiv',
  })
  location?: string;

  @IsOptional()
  @ApiProperty({
    enum: VacancyStatus,
    example: VacancyStatus.OPEN,
  })
  @IsEnum(VacancyStatus)
  status: VacancyStatus;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Technology stack required',
    example: ['Node.js', 'TypeScript', 'PostgreSQL'],
  })
  techStack: string[];
}

export class CreateVacancyResponse extends VacancyBaseResponse {}
