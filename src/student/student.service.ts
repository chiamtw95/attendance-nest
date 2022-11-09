import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const hash = await argon.hash(dto.password);
    try {
      const res = await this.prisma.student.create({
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

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  async updatePW(dto: any) {
    const newHash = await argon.hash(dto.pw);
    try {
      const res = await this.prisma.student.update({
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

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
