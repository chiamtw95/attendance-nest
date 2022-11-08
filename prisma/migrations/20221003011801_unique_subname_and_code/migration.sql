/*
  Warnings:

  - A unique constraint covering the columns `[subjectName]` on the table `subject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectCode]` on the table `subject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subject_subjectName_key" ON "subject"("subjectName");

-- CreateIndex
CREATE UNIQUE INDEX "subject_subjectCode_key" ON "subject"("subjectCode");
