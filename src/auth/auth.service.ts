import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async lectSignup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.lecturer.create({
        data: {
          name: dto.name,
          passwordHash: hash,
          email: dto.email,
        },
      });
      delete user.passwordHash;
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ForbiddenException('Credentials taken');
      throw error;
    }
  }

  async signup(dto: SignupDto, role?: Role) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.student.create({
        data: {
          name: dto.name,
          passwordHash: hash,
          email: dto.email,
          role: role,
        },
      });
      delete user.passwordHash;
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ForbiddenException('Credentials taken');
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    let user;
    user = await this.prisma.student.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      user = await this.prisma.lecturer.findUnique({
        where: {
          email: dto.email,
        },
      });
    }
    // invalid pw or email
    if (!user) throw new ForbiddenException('Incorrect credentials ');
    // if user is a lecturer but not verified by admin

    const pwMatches = await argon.verify(user.passwordHash, dto.password);

    if (!pwMatches) throw new ForbiddenException('Incorrect credentials ');

    delete user.passwordHash;

    const token = await this.signToken(
      user.id,
      user.email,
      user.role,
      user.name,
    );

    return token;
  }

  async signToken(
    userId: string,
    email: string,
    role: string,
    name: string,
  ): Promise<{ access_token: string }> {
    const data = {
      sub: userId,
      email,
      role,
      name,
    };

    const token = await this.jwt.signAsync(data, { expiresIn: '2h' });

    return { access_token: token };
  }
}
