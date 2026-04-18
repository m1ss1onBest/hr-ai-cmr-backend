import { ApiProperty } from '@nestjs/swagger';
export enum MatchRecommendation {
  PROCEED = 'PROCEED',
  REVIEW_MANUALLY = 'REVIEW_MANUALLY',
  REJECT = 'REJECT',
}
export class MatchCandidateResponseDto {
  @ApiProperty({ description: 'Відсоток збігу', example: 85 })
  matchPercentage: number;
  @ApiProperty({
    description: 'Сильні сторони',
    example: ['TypeScript', 'NestJS'],
  })
  strengths: string[];
  @ApiProperty({
    description: 'Що не відповідає вимогам',
    example: ['Немає досвіду з AWS'],
  })
  gaps: string[];
  @ApiProperty({
    enum: MatchRecommendation,
    description: 'Рекомендація системи',
  })
  recommendation: MatchRecommendation;
  @ApiProperty({ description: 'Дата аналізу' })
  analyzedAt: Date;
}
