/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folder_id_userId_key" ON "Folder"("id", "userId");
