import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeResumeRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Plain text content of the resume to analyze',
    example:
      'Іван Петренко, Senior Software Engineer, 7 років досвіду. TypeScript, NestJS, PostgreSQL, Docker, Kubernetes. Працював у 3 продуктових командах.',
  })
  resumeText: string;
}

export class ResumeAnalysisResponse {
  @ApiProperty({
    description: 'Key professional skills extracted from the resume',
    example: ['TypeScript', 'NestJS', 'Problem Solving'],
    type: [String],
  })
  skills: string[];

  @ApiProperty({
    description:
      'Professional level determined by experience and technology complexity',
    example: 'Senior',
    enum: ['Junior', 'Middle', 'Senior'],
    nullable: true,
  })
  level: string | null;

  @ApiProperty({
    description: 'Total years of professional experience',
    example: 7,
    nullable: true,
  })
  yearsOfExperience: number | null;

  @ApiProperty({
    description: 'List of technologies and tools from the resume',
    example: ['TypeScript', 'NestJS', 'PostgreSQL', 'Docker'],
    type: [String],
  })
  technologies: string[];

  @ApiProperty({
    description: 'Soft skills identified in the resume',
    example: ['Leadership', 'Communication', 'Teamwork'],
    type: [String],
    nullable: true,
  })
  softSkills: string[] | null;

  @ApiProperty({
    description:
      'Overall profile score based on completeness and relevance (1-10)',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  score: number;

  @ApiProperty({
    description:
      'Professional, objective summary of the candidate profile (3-5 sentences)',
    example:
      'Experienced Senior Software Engineer with 7 years in full-stack development. Strong expertise in TypeScript and NestJS ecosystem.',
  })
  summary: string;
}
