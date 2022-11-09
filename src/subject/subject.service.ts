import { Student } from './../student/entities/student.entity';
import { Lecturer } from './../lecturer/entities/lecturer.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: any) {
    try {
      const res = await this.prisma.subject.create({
        data: {
          subjectCode: createSubjectDto.subjectCode,
          subjectName: createSubjectDto.subjectName,
          lecturer: { connect: { name: createSubjectDto.lecturerName } },
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException(
          'SubjectCode or SubjectName taken. Please provide unique SubjectCode and Name',
        );
      console.error('error adding sub', e);
    }
  }

  async findAll() {
    try {
      const res = await this.prisma.subject.findMany({
        select: {
          id: true,
          subjectCode: true,
          subjectName: true,
          lecturer: {
            select: {
              name: true,
            },
          },
          student: { select: { name: true } },
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Error fetching all subjects');
      console.error('error adding sub', e);
    }
  }

  async findAllSubLect(id: string) {
    try {
      const res = await this.prisma.lecturer.findUnique({
        where: { id },
        select: {
          subject: true,
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Error fetching all subjects, lect');
      console.error('error adding sub', e);
    }
  }

  async findAllStudentsToEnroll(subjectId: string) {
    try {
      const students = await this.prisma.student.findMany({
        select: { name: true, id: true },
      });
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
          student: { select: { name: true } },
        },
      });
      const enrolledStudents = subject.student.map((x) => x.name);
      const allStudents = students.filter((x) => {
        return !enrolledStudents.includes(x.name);
      });
      return allStudents;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException(
          'Error fetching all possible students to enroll',
        );
      console.error('Error fetching all possible students to enroll', e);
    }
  }

  async enrollStudent(dto: any) {
    const { id, student } = dto || {};
    try {
      const res = await this.prisma.subject.update({
        where: {
          id,
        },
        data: { student: { connect: { name: student } } },
      });

      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException(
          'Error fetching all possible students to enroll',
        );
      console.error('Error fetching all possible students to enroll', e);
    }
  }

  async removeStudent(dto: any) {
    const { id, studentName } = dto || {};
    try {
      const res = await this.prisma.subject.update({
        where: {
          id,
        },
        data: { student: { disconnect: { name: studentName } } },
      });

      const updatedList = await this.prisma.subject.findUnique({
        where: { id },
        include: {
          student: { select: { name: true } },
        },
      });
      return updatedList.student;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException(
          'Error fetching all possible students to enroll',
        );
      console.error('Error fetching all possible students to enroll', e);
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.prisma.subject.findUnique({
        where: {
          id,
        },
        include: {
          lecturer: { select: { name: true } },
          student: { select: { name: true } },
          sessions: {
            select: { id: true, date: true },
            orderBy: { date: 'desc' },
          },
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Error fetching all subjects');
      console.error('error finding sub', e);
    }
  }

  async update(dto: any) {
    try {
      const res = await this.prisma.subject.update({
        where: {
          id: dto.subjectId,
        },
        data: {
          student: { connect: { id: dto.studentId } },
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Error updating subject');
      console.error('error updating sub', e);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.subject.delete({
        where: {
          id,
        },
      });
      return;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Incorrect id. Error deleting subject');
      console.error('error deleting sub', e);
    }
  }

  async createSession(dto: any) {
    try {
      const res = await this.prisma.session.create({
        data: {
          subjectId: dto.subjectId,
          lecturerId: dto.lecturerId,
        },
      });

      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Incorrect id. Error deleting subject');
      console.error('error deleting sub', e);
    }
  }
}
