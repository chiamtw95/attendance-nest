import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class LecturerService {
  constructor(private prisma: PrismaService) {}

  async registerLecturer(dto: any) {
    const hash = await argon.hash(dto.password);
    try {
      const res = await this.prisma.lecturer.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash: hash,
        },
      });
      delete res.passwordHash;
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Error fetching all lecturers');
      console.error('error finding lecturer', e);
    }
  }

  async findAll() {
    try {
      const res = await this.prisma.lecturer.findMany({
        select: {
          name: true,
          session: true,
          subject: true,
        },
      });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Error fetching all lecturers');
      console.error('error finding lecturer', e);
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.prisma.lecturer.findUnique({ where: { id } });
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Error finding lecturer');
      console.error('Error finding lecturer', e);
    }
  }

  async updatePW(dto: any) {
    const newHash = await argon.hash(dto.pw);
    try {
      const res = await this.prisma.lecturer.update({
        where: { id: dto.id },
        data: {
          passwordHash: newHash,
        },
      });
      return { message: 'Password updated!' };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Error updating pw lec');
      console.error('Error updating pw lec', e);
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} lecturer`;
  // }
}
