/*
  Warnings:

  - You are about to drop the column `cvFile` on the `CandidateCredential` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `CandidateCredential` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `CandidateCredential` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cv_file` to the `CandidateCredential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `CandidateCredential` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CandidateCredential_phoneNumber_key";

-- AlterTable
ALTER TABLE "CandidateCredential" DROP COLUMN "cvFile",
DROP COLUMN "phoneNumber",
ADD COLUMN     "cv_file" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CandidateCredential_phone_number_key" ON "CandidateCredential"("phone_number");
