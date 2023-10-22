-- AlterTable
ALTER TABLE "SetAutoSave" ADD COLUMN     "definitionLanguage" "Language" NOT NULL DEFAULT 'English',
ADD COLUMN     "wordLanguage" "Language" NOT NULL DEFAULT 'English';
