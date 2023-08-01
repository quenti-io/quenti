-- CreateTable
CREATE TABLE "WhitelistedEmail" (
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhitelistedEmail_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistedEmail_email_key" ON "WhitelistedEmail"("email");
