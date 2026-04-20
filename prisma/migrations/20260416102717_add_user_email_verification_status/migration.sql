-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationCode" VARCHAR(32),
ADD COLUMN     "emailVerificationExpiresAt" TIMESTAMP(3),
ADD COLUMN     "emailVerificationSentAt" TIMESTAMP(3),
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
