/*
  Warnings:

  - You are about to drop the column `currentStatus` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Candidate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionId` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "currentStatus",
DROP COLUMN "position",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "linkedInUrl" VARCHAR(2048),
ADD COLUMN     "phone" VARCHAR(50),
ADD COLUMN     "positionId" TEXT NOT NULL,
ALTER COLUMN "cvUrl" DROP NOT NULL,
ALTER COLUMN "expectedSalary" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_key" ON "Position"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
