/*
  Warnings:

  - You are about to drop the column `positionId` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `position` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_positionId_fkey";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "positionId",
ADD COLUMN     "position" TEXT NOT NULL;

-- DropTable
DROP TABLE "Position";
