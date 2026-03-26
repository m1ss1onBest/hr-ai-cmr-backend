import { CandidateModel } from 'prisma/generated/models';

export interface ICandidateData {
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

export class Candidate implements ICandidateData {
  id: string;
  name: string;
  cvUrl: string;
  expectedSalary: string;
  currentStatus: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(props: CandidateModel | ICandidateData) {
    Object.assign(this, props);
  }
}
