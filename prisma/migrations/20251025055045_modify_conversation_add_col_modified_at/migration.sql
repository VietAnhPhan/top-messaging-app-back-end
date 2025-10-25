-- AlterTable
ALTER TABLE "public"."Conversation" ADD COLUMN     "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
