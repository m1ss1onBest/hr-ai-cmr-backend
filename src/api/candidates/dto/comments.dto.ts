import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCandidateCommentRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  @ApiProperty({
    description: 'Comment text',
    example: 'Great communication skills. Follow up about salary expectations.',
  })
  text: string;
}

export class UpdateCandidateCommentRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  @ApiProperty({
    description: 'Updated comment text',
    example: 'Updated: candidate confirmed availability from May.',
  })
  text: string;
}

export class CommentAuthorDto {
  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'HR Manager' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'hr@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'HR' })
  role: string;
}

export class CandidateCommentResponse {
  @IsUUID()
  @ApiProperty({ description: 'Comment id' })
  id: string;

  @IsUUID()
  @ApiProperty({ description: 'Candidate id' })
  candidateId: string;

  @IsString()
  @ApiProperty({ description: 'Comment text' })
  text: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Deleted at (soft delete)' })
  deletedAt?: Date | null;

  @ApiProperty({ type: CommentAuthorDto })
  author: CommentAuthorDto;
}
