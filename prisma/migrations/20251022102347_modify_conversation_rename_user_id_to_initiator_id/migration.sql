/*
  Warnings:

  - You are about to drop the column `initiator_Id` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_initiator_Id_fkey";

-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "initiator_Id",
ADD COLUMN     "initiatorId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
