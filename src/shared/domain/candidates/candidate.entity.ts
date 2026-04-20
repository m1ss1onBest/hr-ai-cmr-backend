import { CandidateModel } from 'prisma/generated/models';

export interface ICandidateData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedInUrl?: string;
  comment?: string;
  cvUrl?: string;
  expectedSalary?: string;
  positionId: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  currentStatus?: string;
}

export class Candidate implements ICandidateData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedInUrl?: string;
  comment?: string;
  cvUrl?: string;
  expectedSalary?: string;
  positionId: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  currentStatus?: string;

  constructor(props: CandidateModel | ICandidateData) {
    Object.assign(this, props);
  }
}
