-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "lecturer" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" INTEGER[],

    CONSTRAINT "lecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sessionId" INTEGER[],
    "subjectId" INTEGER[],

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "subjectName" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER[],
    "subjectId" INTEGER NOT NULL,
    "lecturerId" INTEGER NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LecturerToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StudentToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SessionToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "lecturer_email_key" ON "lecturer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_name_key" ON "student"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_LecturerToSubject_AB_unique" ON "_LecturerToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_LecturerToSubject_B_index" ON "_LecturerToSubject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentToSubject_AB_unique" ON "_StudentToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentToSubject_B_index" ON "_StudentToSubject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SessionToStudent_AB_unique" ON "_SessionToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionToStudent_B_index" ON "_SessionToStudent"("B");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "lecturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LecturerToSubject" ADD CONSTRAINT "_LecturerToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "lecturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LecturerToSubject" ADD CONSTRAINT "_LecturerToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToSubject" ADD CONSTRAINT "_StudentToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToSubject" ADD CONSTRAINT "_StudentToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionToStudent" ADD CONSTRAINT "_SessionToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionToStudent" ADD CONSTRAINT "_SessionToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
