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

const RESUME_ANALYSIS_SYSTEM_PROMPT = `You are an HR Data Analyst with 10 years of experience. Your task is to conduct a deep technical audit of a resume and structure the data for a database.

### INSTRUCTIONS:
1. Analyze the resume text based on context (projects, job titles, description of duties).
2. Determine the seniority level (Junior/Middle/Senior) not only by years but also by the complexity of technologies.
3. If a specific parameter is missing from the text (e.g., Soft Skills are not specified) — return null.
4. The Summary must be professional, objective, and consist of 3-5 sentences.
5. The Score (1-10) is based on profile integrity and relevance of experience.

### RESPONSE FORMAT (JSON):
{
  "skills": ["string"],
  "level": "Junior" | "Middle" | "Senior" | null,
  "yearsOfExperience": number | null,
  "technologies": ["string"],
  "softSkills": ["string"] | null,
  "score": number (1-10),
  "summary": "string (3-5 sentences)"
}

Respond EXCLUSIVELY with a JSON object.`;

const MATCH_CANDIDATE_WITH_VACANCY_SYSTEM_PROMPT = `You are an Expert Technical HR Analyst with 10 years of experience in recruitment. Your task is to perform a deep comparative analysis between a candidate's profile (resume analysis) and a job vacancy's requirements, and determine how well they match.

### INSTRUCTIONS:
1. Analyze the provided JSON containing the candidate's parsed resume and the JSON containing the vacancy requirements.
2. Compare the candidate's skills, level, experience, and technologies against the vacancy's mandatory and nice-to-have requirements.
3. Calculate an objective "matchPercentage" (0 to 100) representing how well the candidate fits the role. Be strict but fair.
4. Identify 3-5 key "strengths" where the candidate perfectly aligns with or exceeds the vacancy requirements.
5. Identify any "gaps" (missing skills, insufficient experience, etc.) where the candidate falls short. If none, return an empty array.
6. Provide a final "recommendation" strictly using one of the following exact string values: "PROCEED" | "REVIEW_MANUALLY" | "REJECT".

### RESPONSE FORMAT (JSON):
{
  "recommendation": "PROCEED" | "REVIEW_MANUALLY" | "REJECT",
  "matchPercentage": number (0-100),
  "strengths": ["string"],
  "gaps": ["string"]
}

Respond EXCLUSIVELY with a valid JSON object.`;
@Injectable()
export class AiService {
  private readonly logger = new EventHandlerLogger(AiService.name);

  constructor(private readonly aiProvider: IAiProvider) {}

  async analyzeResumeFromFile(
    fileBuffer: Buffer,
    mimeType: string = 'application/pdf',
  ): Promise<ResumeAnalysisResult> {
    this.logger.log('Starting resume analysis from PDF file...');

    const result = await this.aiProvider.analyzeFile<ResumeAnalysisResult>(
      fileBuffer,
      mimeType,
      RESUME_ANALYSIS_SYSTEM_PROMPT,
    );

    this.logger.log(
      `File analysis completed | level=${result.level} | score=${result.score}`,
    );

    return result;
  }

  async analyzeResumeFromText(text: string): Promise<ResumeAnalysisResult> {
    this.logger.log('Starting resume analysis from text (DOCX)...');

    const result =
      await this.aiProvider.analyzeStructured<ResumeAnalysisResult>(
        text,
        RESUME_ANALYSIS_SYSTEM_PROMPT,
      );

    this.logger.log(
      `Text analysis completed | level=${result.level} | score=${result.score}`,
    );

    return result;
  }

  async matchCandidateWithVacancy(
    resumeAnalysis: string,
    vacancy: string,
  ): Promise<MatchCandidateWithVacancyResult> {
    this.logger.log('Starting candidate-vacancy matching via AI...');

    const collectedPrompt = `Candidate Resume: ${resumeAnalysis}\n\nVacancy: ${vacancy}`;

    const result =
      await this.aiProvider.analyzeStructured<MatchCandidateWithVacancyResult>(
        collectedPrompt,
        MATCH_CANDIDATE_WITH_VACANCY_SYSTEM_PROMPT,
      );

    this.logger.log(
      `Matching completed | recommendation=${result.recommendation} | matchPercentage=${result.matchPercentage}`,
    );

    return result;
  }
}
