-- Rename emailVerificationCode -> emailVerificationToken (preserve data)
ALTER TABLE "User" RENAME COLUMN "emailVerificationCode" TO "emailVerificationToken";

-- Drop unused column
ALTER TABLE "User" DROP COLUMN "emailVerificationSentAt";

-- Ensure length is sufficient
ALTER TABLE "User" ALTER COLUMN "emailVerificationToken" TYPE VARCHAR(64);

