-- CreateEnum
CREATE TYPE "EnabledFeature" AS ENUM ('ExtendedFeedbackBank');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "features" "EnabledFeature"[] DEFAULT ARRAY[]::"EnabledFeature"[];
