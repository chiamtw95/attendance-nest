import { Student } from './../student/entities/student.entity';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSessionDto } from './dto/update-session.dto';
import e from 'express';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async create(createSessionDto: any) {
    try {
      const res = await this.prisma.session.create({
        data: {
          subjectId: createSessionDto.subjectId,
          lecturerId: createSessionDto.lecturerId,
        },
      });

      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException(
          'Incorrect  subjectid or lecturerid. Error creating session',
        );
      console.error('error creating session , session service', e);
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.prisma.session.findUnique({
        where: {
          id,
        },
        include: {
          subject: true,
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException(
          'Error fetching all subjects, session service',
        );
      console.error('error finding sub ,  session service', e);
    }
  }

  // attendance update
  async takeAttendance(dto: any) {
    try {
      const session = await this.prisma.session.findUnique({
        where: {
          sessionCode: dto.checkInCode,
        },
        include: {
          student: { select: { id: true } },
          subject: { include: { student: { select: { id: true } } } },
        },
      });

      const timeDiff =
        (new Date().getTime() - session?.date?.getTime()) / 60000;

      // check is there is a session that exists with the given code
      if (!session) return { message: 'Check in code invalid!' };

      // reject checkin attempt if user not enrolled
      if (!session?.subject?.student?.find((x) => x?.id === dto?.studentId))
        return { message: 'You are not enrolled in this subject!' };

      // reject checkin attempt when 1 hour has passed
      if (timeDiff > 60)
        return { message: 'Check in code has already expired!' };

      // checks whether  student is already checkedin
      if (session?.student?.find((x) => x?.id === dto?.studentId))
        return { message: 'Already Checked in!' };

      const res = await this.prisma.session.update({
        where: {
          sessionCode: dto.checkInCode,
        },
        data: {
          student: { connect: { id: dto.studentId } },
        },
        include: {
          subject: true,
        },
      });
      return {
        res,
        message: `You have succesfully checked in to ${res.subject.subjectCode} ${res.subject.subjectName}!`,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2016')
        throw new HttpException('Check in code invalid ', HttpStatus.NOT_FOUND);
      console.error('Check in code invalid', e);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
