/*
  Warnings:

  - A unique constraint covering the columns `[sessionCode]` on the table `session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "session_sessionCode_key" ON "session"("sessionCode");
