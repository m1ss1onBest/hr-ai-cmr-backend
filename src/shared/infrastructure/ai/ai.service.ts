import { Injectable } from '@nestjs/common';
import { IAiProvider } from './contracts/ai-provider.interface';
import { EventHandlerLogger } from '../logger/handler-logger.service';


export interface ResumeAnalysisResult {
  skills: string[];
  level: string | null;
  yearsOfExperience: number | null;
  technologies: string[];
  softSkills: string[] | null;
  score: number;
  summary: string;
}
export enum MatchRecommendation {
  PROCEED = 'PROCEED',
  REVIEW_MANUALLY = 'REVIEW_MANUALLY',
  REJECT = 'REJECT',
}
export interface MatchCandidateWithVacancyResult {
  recommendation: MatchRecommendation;
  matchPercentage: number;
  strengths: string[];
  gaps: string[];
}

const RESUME_ANALYSIS_SYSTEM_PROMPT = `Ти — HR-аналітик з 10-річним досвідом. Твоє завдання: провести глибокий технічний аудит резюме та структурувати дані для бази даних.

### ІНСТРУКЦІЇ:
1. Аналізуй текст резюме на основі контексту (проєкти, назви посад, опис обов'язків).
2. Визнач рівень (Junior/Middle/Senior) не лише за роками, а й за складністю технологій.
3. Якщо конкретний параметр відсутній у тексті (наприклад, не вказано Soft Skills) — повертай null.
4. Summary має бути професійним, об'єктивним та складатись з 3-5 речень.
5. Score (1-10) базується на цілісності профілю та релевантності досвіду.

### ФОРМАТ ВІДПОВІДІ (JSON):
{
  "skills": ["string"],
  "level": "Junior" | "Middle" | "Senior" | null,
  "yearsOfExperience": number | null,
  "technologies": ["string"],
  "softSkills": ["string"] | null,
  "score": number (1-10),
  "summary": "string (3-5 sentences)"
}

Відповідай ВИКЛЮЧНО об'єктом JSON.`;

const MATCH_CANDIDATE_WITH_VACANCY_SYSTEM_PROMPT = ``;
@Injectable()
export class AiService {
  private readonly logger = new EventHandlerLogger(AiService.name);

  constructor(private readonly aiProvider: IAiProvider) {}

  async analyzeResume(resumeText: string): Promise<ResumeAnalysisResult> {
    this.logger.log('Starting resume analysis via AI...');

    const result =
      await this.aiProvider.analyzeStructured<ResumeAnalysisResult>(
        resumeText,
        RESUME_ANALYSIS_SYSTEM_PROMPT,
      );

    this.logger.log(
      `Resume analysis completed | level=${result.level} | score=${result.score}`,
    );

    return result;
  }

  async matchCandidateWithVacancy(
    resumeAnalysis: string,
    vacancy: string,
  ): Promise<MatchCandidateWithVacancyResult> {
    this.logger.log('Starting candidate-vacancy matching via AI...');
    const collectedPrompt = `Candidate Resume: ${resumeAnalysis}\n
    Vacancy: ${vacancy}`;

    const result =
      await this.aiProvider.analyzeStructured<MatchCandidateWithVacancyResult>(
        collectedPrompt,
        MATCH_CANDIDATE_WITH_VACANCY_SYSTEM_PROMPT,
      );

    this.logger.log(
      `Candidate-vacancy matching completed | recommendation=${result.recommendation} | matchPercentage=${result.matchPercentage}`,
    );

    return result;
  }
}
