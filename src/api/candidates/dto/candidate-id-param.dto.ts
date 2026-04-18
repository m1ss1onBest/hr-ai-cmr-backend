import { IsNotEmpty, IsUUID } from 'class-validator';

export class CandidateIdDto {
  @IsNotEmpty()
  @IsUUID()
  candidateId: string;
}
