-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySetsOnFolders" (
    "studySetId" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,

    CONSTRAINT "StudySetsOnFolders_pkey" PRIMARY KEY ("studySetId","folderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_userId_slug_key" ON "Folder"("userId", "slug");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySetsOnFolders" ADD CONSTRAINT "StudySetsOnFolders_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySetsOnFolders" ADD CONSTRAINT "StudySetsOnFolders_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
