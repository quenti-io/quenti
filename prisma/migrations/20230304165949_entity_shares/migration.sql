-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('StudySet', 'Folder');

-- CreateTable
CREATE TABLE "EntityShare" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,

    CONSTRAINT "EntityShare_pkey" PRIMARY KEY ("id","entityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntityShare_entityId_key" ON "EntityShare"("entityId");
