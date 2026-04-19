import { IBaseUseCase } from 'src/shared/contracts/use-cases/base.use-case';
import {
  AnalyzeResumeRequest,
  ResumeAnalysisResponse,
} from '../../dto/analyze-resume.dto';
import { Provider } from '@nestjs/common';
import { AnalyzeResumeUseCase } from './analyze-resume.use-case';

export abstract class IAnalyzeResumeUseCase extends IBaseUseCase<
  AnalyzeResumeRequest & { candidateId: string },
  ResumeAnalysisResponse
> {}

export const ANALYZE_RESUME_USE_CASE_PROVIDER: Provider = {
  provide: IAnalyzeResumeUseCase,
  useClass: AnalyzeResumeUseCase,
};
