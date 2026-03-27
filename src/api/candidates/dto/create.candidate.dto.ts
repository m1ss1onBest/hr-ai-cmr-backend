import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { CandidateBaseResponse } from './candidate.base-response';

export class CreateCandidateRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsUrl()
  @MaxLength(255)
  cvUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  expectedSalary: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  position: string;
}

export class CreateCandidateResponse extends CandidateBaseResponse {}
