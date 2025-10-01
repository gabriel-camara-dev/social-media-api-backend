-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "follows" DROP CONSTRAINT "follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "reposts" DROP CONSTRAINT "reposts_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "reposts" DROP CONSTRAINT "reposts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "reposts" DROP CONSTRAINT "reposts_user_id_fkey";

-- AlterTable
ALTER TABLE "follows" ALTER COLUMN "followerId" SET DATA TYPE TEXT,
ALTER COLUMN "followingId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "reposts" ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "comment_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("public_id") ON DELETE CASCADE ON UPDATE CASCADE;
