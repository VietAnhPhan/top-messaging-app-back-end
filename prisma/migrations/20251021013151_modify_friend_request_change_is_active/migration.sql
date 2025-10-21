/*
  Warnings:

  - You are about to drop the column `isActived` on the `FriendRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."FriendRequest" DROP COLUMN "isActived",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
