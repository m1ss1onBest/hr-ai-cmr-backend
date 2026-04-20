import { VacancyStatus } from 'prisma/generated/enums';
export { VacancyStatus };

export interface IVacancyData {
  id: string;
  title: string;
  description: string;
  salaryRange?: string | null;
  workMode?: string | null;
  experience?: string | null;
  location?: string | null;
  status: VacancyStatus;
  techStack: string[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Vacancy implements IVacancyData {
  id: string;
  title: string;
  description: string;
  salaryRange?: string | null;
  workMode?: string | null;
  experience?: string | null;
  location?: string | null;
  status: VacancyStatus;
  techStack: string[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(props: IVacancyData) {
    Object.assign(this, props);
  }
}
