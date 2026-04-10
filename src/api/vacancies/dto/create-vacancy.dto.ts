import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VacancyBaseResponse } from './vacancy.base-response';

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
    example: '3000 USD',
  })
  salary?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Array of candidate requirements',
    example: ['3+ years experience', 'English B2', 'Team management'],
  })
  requirements: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Technology stack required',
    example: ['Node.js', 'TypeScript', 'PostgreSQL'],
  })
  techStack: string[];
}

export class CreateVacancyResponse extends VacancyBaseResponse {}
