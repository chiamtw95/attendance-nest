import { Student } from './../student/entities/student.entity';
import { ForbiddenException, Injectable, Delete } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { doesNotThrow } from 'assert';
import { debugPort } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(sessionId: string, studentName: string) {
    try {
      const res = await this.prisma.session.update({
        where: {
          id: sessionId,
        },
        data: {
          student: { connect: { name: studentName } },
        },
      });

      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException('SessionId invalid.');
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025')
        throw new ForbiddenException('Student not found ');
      console.error('error adding student attendance', e);
    }
  }

  async findAll(sessionId: string) {
    try {
      const res = await this.prisma.session.findUnique({
        where: {
          id: sessionId,
        },
        include: {
          student: {
            select: { name: true },
          },
        },
      });
      return res.student;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException('SessionId invalid.');
      console.error('error fetching all attendance', e);
    }
  }

  async removeAttendance(sessionId: string, studentId: string) {
    try {
      const res = await this.prisma.session.update({
        where: {
          id: sessionId,
        },
        data: {
          student: { disconnect: { id: studentId } },
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException('SessionId invalid or studentId invalid.');
      console.error('error removing attendance', e);
    }
  }

  async findOrcreateCheckInCode(dto: any) {
    console.log('dto', dto);
    try {
      const res = await this.prisma.session.findUnique({
        where: { id: dto.sessionId },
        select: { sessionCode: true },
      });
      if (res?.sessionCode) return res;
      const generateSessionCode = (): string => {
        const strArr = dto.sessionId.split('-');
        console.log('straer', strArr);
        const code = strArr.map((x) => x.charCodeAt(0).toString());
        const finalCode = code.map((x) => x.slice(-1)).join('');
        return finalCode;
      };
      const checkInCode = generateSessionCode();

      const updateRes = await this.prisma.session.update({
        where: { id: dto.sessionId },
        data: { sessionCode: checkInCode },
      });
      return updateRes;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException('lecturer and/or student id invalid.');
      console.error('error creating new session', e);
    }
  }
  async findCheckedInStudents(dto: any) {
    const notCheckedIn = [];
    console.log(dto);
    try {
      const session = await this.prisma.session.findUnique({
        where: { id: dto.sessionId },
        include: {
          student: { select: { name: true } },
        },
      });
      const checkedInStudents = session.student.map((x) => x.name);
      const subject = await this.prisma.subject.findUnique({
        where: { id: session.subjectId },
        include: { student: { select: { name: true } } },
      });

      subject.student.map((x) => {
        if (!checkedInStudents.includes(x.name))
          return notCheckedIn.push(x.name);
      });

      delete subject.student;
      return {
        checkedIn: checkedInStudents,
        notCheckedIn: notCheckedIn,
        subject,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ForbiddenException('Session id invalid.');
      console.error('error finding checked-in students', e);
    }
  }
}
