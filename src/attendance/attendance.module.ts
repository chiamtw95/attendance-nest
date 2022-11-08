import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceGateway } from './attendance.gateway';
import { AttendanceController } from './attendance.controller';

@Module({
  providers: [AttendanceGateway, AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
