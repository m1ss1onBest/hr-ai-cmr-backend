import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import { Provider } from '@nestjs/common';
import { AnalyzeResumeUseCase } from './analyze-resume.use-case';
import { ResumeAnalysisResponse } from '../../dto/analyze-resume.dto';

export abstract class IAnalyzeResumeUseCase extends IBaseUseCase<
  string,
  ResumeAnalysisResponse
> {}

export const ANALYZE_RESUME_USE_CASE_PROVIDER: Provider = {
  provide: IAnalyzeResumeUseCase,
  useClass: AnalyzeResumeUseCase,
};
