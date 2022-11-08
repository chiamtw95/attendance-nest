import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

// @UseGuards(JwtGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('checkincode')
  createCheckinCode(@Query() dto: any) {
    console.log(dto);
    return this.attendanceService.findOrcreateCheckInCode(dto);
  }

  @Get('checkincode/studentList')
  getStudentsList(@Query() dto: any) {
    // console.log(dto);
    return this.attendanceService.findCheckedInStudents(dto);
  }
}
