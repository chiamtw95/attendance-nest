/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `lecturer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lecturer_name_key" ON "lecturer"("name");
