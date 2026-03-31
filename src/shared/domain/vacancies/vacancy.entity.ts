export interface IVacancyData {
  id: string;
  title: string;
  description: string;
  salary?: string | null;
  requirements: unknown;
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
  salary?: string | null;
  requirements: unknown;
  techStack: string[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  constructor(props: IVacancyData) {
    Object.assign(this, props);
  }
}
