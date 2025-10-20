-- CreateEnum
CREATE TYPE "public"."FriendStatus" AS ENUM ('pending', 'friends', 'stranger');

-- AlterTable
ALTER TABLE "public"."Conversation" ADD COLUMN     "userId" INTEGER,
ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "uuid" TEXT;

-- CreateTable
CREATE TABLE "public"."FriendRequest" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "isActived" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Friend" (
    "id" SERIAL NOT NULL,
    "friendId" INTEGER NOT NULL,
    "loginuserId" INTEGER NOT NULL,
    "status" "public"."FriendStatus" NOT NULL DEFAULT 'friends',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "public"."FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_loginuserId_friendId_key" ON "public"."Friend"("loginuserId", "friendId");

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Friend" ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Friend" ADD CONSTRAINT "Friend_loginuserId_fkey" FOREIGN KEY ("loginuserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
