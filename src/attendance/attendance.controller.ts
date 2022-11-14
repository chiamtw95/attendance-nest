import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

// @UseGuards(JwtGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('checkincode')
  createCheckinCode(@Query() dto: any) {
    return this.attendanceService.findOrcreateCheckInCode(dto);
  }

  @Get('attendeesList')
  findAttendees(@Query('sessionId') sessionId: string) {
    return this.attendanceService.findAll(sessionId);
  }

  @Get('checkincode/studentList')
  getStudentsList(@Query() dto: any) {
    return this.attendanceService.findCheckedInStudents(dto);
  }

  @Get('report')
  getReport(@Query() dto: any) {
    return this.attendanceService.getReportData(dto);
  }
}
