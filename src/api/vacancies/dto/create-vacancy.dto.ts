export class CreateVacancyDto {
  title: string;
  description: string;
  salary?: string;
  requirements: string[];

  //TODO: поки тут хай бeде
  createdById: string;
}
