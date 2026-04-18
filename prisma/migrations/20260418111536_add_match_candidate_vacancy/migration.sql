-- CreateEnum
CREATE TYPE "MatchRecommendation" AS ENUM ('PROCEED', 'REVIEW_MANUALLY', 'REJECT');

-- CreateTable
CREATE TABLE "MatchCandidateWithVacancy" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "vacancyId" TEXT NOT NULL,
    "recommendation" "MatchRecommendation" NOT NULL,
    "matchPercentage" INTEGER NOT NULL,
    "strengths" JSONB NOT NULL,
    "gaps" JSONB NOT NULL,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchCandidateWithVacancy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchCandidateWithVacancy_candidateId_vacancyId_key" ON "MatchCandidateWithVacancy"("candidateId", "vacancyId");

-- AddForeignKey
ALTER TABLE "MatchCandidateWithVacancy" ADD CONSTRAINT "MatchCandidateWithVacancy_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchCandidateWithVacancy" ADD CONSTRAINT "MatchCandidateWithVacancy_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
