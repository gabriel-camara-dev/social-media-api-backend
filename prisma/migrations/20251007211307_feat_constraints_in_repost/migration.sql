/*
  Warnings:

  - A unique constraint covering the columns `[user_id,post_id]` on the table `reposts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,comment_id]` on the table `reposts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reposts_user_id_post_id_key" ON "reposts"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "reposts_user_id_comment_id_key" ON "reposts"("user_id", "comment_id");
