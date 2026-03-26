import { IsString, IsUrl } from 'class-validator';
import { CandidateBaseResponse } from './candidate.base-response';

export class CreateCandidateRequest {
  @IsString()
  name: string;

  @IsUrl()
  cvUrl: string;

  @IsString()
  expectedSalary: string;

  @IsString()
  position: string;
}

export class CreateCandidateResponse extends CandidateBaseResponse {}
