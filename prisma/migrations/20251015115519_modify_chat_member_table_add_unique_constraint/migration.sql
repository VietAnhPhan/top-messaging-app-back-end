/*
  Warnings:

  - A unique constraint covering the columns `[conversationId,userId]` on the table `ChatMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatMember_conversationId_userId_key" ON "public"."ChatMember"("conversationId", "userId");
