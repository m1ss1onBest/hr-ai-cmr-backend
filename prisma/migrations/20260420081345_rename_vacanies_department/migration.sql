/*
  Warnings:

  - You are about to drop the column `departament` on the `Vacancy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "departament",
ADD COLUMN     "department" VARCHAR(255);
