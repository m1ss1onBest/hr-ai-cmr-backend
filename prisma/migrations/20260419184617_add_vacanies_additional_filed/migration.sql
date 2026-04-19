/*
  Warnings:

  - You are about to drop the column `requirements` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `Vacancy` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VacancyStatus" AS ENUM ('OPEN', 'CLOSED', 'PAUSED');

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "requirements",
DROP COLUMN "salary",
ADD COLUMN     "experience" VARCHAR(255),
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "salaryRange" VARCHAR(255),
ADD COLUMN     "status" "VacancyStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "workMode" VARCHAR(255);
