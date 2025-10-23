/*
  Warnings:

  - You are about to drop the column `userId` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "userId",
ADD COLUMN     "initiator_Id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_initiator_Id_fkey" FOREIGN KEY ("initiator_Id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
