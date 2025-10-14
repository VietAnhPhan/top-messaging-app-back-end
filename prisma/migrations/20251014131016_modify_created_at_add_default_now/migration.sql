-- AlterTable
ALTER TABLE "public"."Conversation" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Message" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
