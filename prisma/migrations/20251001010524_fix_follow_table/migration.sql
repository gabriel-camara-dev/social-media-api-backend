/*
  Warnings:

  - You are about to drop the column `created_at` on the `follows` table. All the data in the column will be lost.
  - You are about to drop the column `follower_id` on the `follows` table. All the data in the column will be lost.
  - You are about to drop the column `following_id` on the `follows` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `follows` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `followerId` to the `follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingId` to the `follows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_following_id_fkey";

-- DropIndex
DROP INDEX "follows_follower_id_following_id_key";

-- AlterTable
ALTER TABLE "follows" DROP COLUMN "created_at",
DROP COLUMN "follower_id",
DROP COLUMN "following_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD COLUMN     "followingId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "follows"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
