/*
  Warnings:

  - You are about to drop the column `isAccepted` on the `FriendRequest` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."FriendRequestStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "public"."FriendRequest" DROP COLUMN "isAccepted",
ADD COLUMN     "status" "public"."FriendRequestStatus" NOT NULL DEFAULT 'pending';
