-- CreateEnum
CREATE TYPE "StudySetVisibility" AS ENUM ('Private', 'Unlisted', 'Public');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" CITEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "StudySet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "visibility" "StudySetVisibility" NOT NULL DEFAULT 'Public',

    CONSTRAINT "StudySet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetAutoSave" (
    "userId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "visibility" "StudySetVisibility" NOT NULL DEFAULT 'Public',

    CONSTRAINT "SetAutoSave_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Term" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "studySetId" TEXT NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoSaveTerm" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "setAutoSaveId" TEXT NOT NULL,

    CONSTRAINT "AutoSaveTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySetExperience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL,
    "shuffleFlashcards" BOOLEAN NOT NULL DEFAULT false,
    "learnRound" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StudySetExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudiableTerm" (
    "userId" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "correctness" INTEGER NOT NULL,
    "appearedInRound" INTEGER NOT NULL,

    CONSTRAINT "StudiableTerm_pkey" PRIMARY KEY ("userId","termId")
);

-- CreateTable
CREATE TABLE "StarredTerm" (
    "userId" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,

    CONSTRAINT "StarredTerm_pkey" PRIMARY KEY ("userId","termId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "StudySet_id_userId_key" ON "StudySet"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Term_id_studySetId_key" ON "Term"("id", "studySetId");

-- CreateIndex
CREATE UNIQUE INDEX "StudySetExperience_userId_studySetId_key" ON "StudySetExperience"("userId", "studySetId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySet" ADD CONSTRAINT "StudySet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetAutoSave" ADD CONSTRAINT "SetAutoSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoSaveTerm" ADD CONSTRAINT "AutoSaveTerm_setAutoSaveId_fkey" FOREIGN KEY ("setAutoSaveId") REFERENCES "SetAutoSave"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySetExperience" ADD CONSTRAINT "StudySetExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySetExperience" ADD CONSTRAINT "StudySetExperience_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiableTerm" ADD CONSTRAINT "StudiableTerm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiableTerm" ADD CONSTRAINT "StudiableTerm_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudiableTerm" ADD CONSTRAINT "StudiableTerm_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "StudySetExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredTerm" ADD CONSTRAINT "StarredTerm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredTerm" ADD CONSTRAINT "StarredTerm_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredTerm" ADD CONSTRAINT "StarredTerm_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "StudySetExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
