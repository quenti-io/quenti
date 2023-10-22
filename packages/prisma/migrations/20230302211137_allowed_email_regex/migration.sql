-- CreateTable
CREATE TABLE "AllowedEmailRegex" (
    "regex" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowedEmailRegex_pkey" PRIMARY KEY ("regex")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllowedEmailRegex_regex_key" ON "AllowedEmailRegex"("regex");
