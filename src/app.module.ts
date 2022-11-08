import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { SubjectModule } from './subject/subject.module';
import { StudentModule } from './student/student.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    AttendanceModule,
    SubjectModule,
    LecturerModule,
    StudentModule,
    SessionModule,
  ],
  providers: [PrismaService],
  controllers: [],
})
export class AppModule {}
