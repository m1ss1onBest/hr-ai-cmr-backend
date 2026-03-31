import { ApiProperty } from '@nestjs/swagger';
import { IVacancyData } from 'src/shared/domain/vacancies/vacancy.entity';

export class VacancyBaseResponse implements IVacancyData {
  @ApiProperty({
    description: 'Vacancy UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Vacancy title (position name)',
    example: 'Senior Node.js Developer',
  })
  title: string;

  @ApiProperty({
    description: 'Vacancy description',
    example: 'We are looking for an experienced backend developer...',
  })
  description: string;

  @ApiProperty({
    required: false,
    description: 'Offered salary',
    example: '3000 USD',
  })
  salary?: string;

  @ApiProperty({
    description: 'Array of candidate requirements',
    example: ['3+ years experience', 'English B2', 'Team management'],
  })
  requirements: unknown;

  @ApiProperty({
    description: 'Technology stack',
    example: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
  })
  techStack: string[];

  @ApiProperty({
    description: 'ID of user who created the vacancy',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdById: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2026-03-31T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2026-03-31T12:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    required: false,
    description: 'Deletion date (soft delete)',
    example: null,
  })
  deletedAt?: Date;
}
