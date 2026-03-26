import { ICandidateData } from 'src/shared/domain/users/candidate.entity';

export class CandidateBaseResponse implements ICandidateData {
  id: string;
  name: string;
  cvUrl: string;
  expectedSalary: string;
  currentStatus: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
