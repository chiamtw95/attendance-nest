/*
  Warnings:

  - You are about to drop the column `subjectId` on the `lecturer` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lecturer" DROP COLUMN "subjectId";

-- AlterTable
ALTER TABLE "session" DROP COLUMN "studentId";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "sessionId",
DROP COLUMN "subjectId";
