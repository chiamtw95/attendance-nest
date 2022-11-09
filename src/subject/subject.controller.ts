import { JwtGuard } from 'src/auth/guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Subject } from '@prisma/client';
import { SubjectService } from './subject.service';

// @UseGuards(JwtGuard)
@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post()
  create(@Body() createSubjectDto: any) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @Get('lect')
  findAllLect(@Query() dto: any) {
    return this.subjectService.findAllSubLect(dto.id);
  }

  @Get('studentsenroll')
  findAllStudentsToEnroll(@Query() dto: any) {
    return this.subjectService.findAllStudentsToEnroll(dto.id);
  }

  @Post('studentsenroll')
  enrollStudent(@Body() dto: any) {
    return this.subjectService.enrollStudent(dto);
  }

  @Post('session/create')
  createSession(@Body() dto: any) {
    return this.subjectService.createSession(dto);
  }

  @Put('studentsenroll')
  removeStudent(@Body() dto: any) {
    return this.subjectService.removeStudent(dto);
  }

  @Get('details')
  findOne(@Query('id') id: string) {
    return this.subjectService.findOne(id);
  }

  @Patch()
  update(@Body() dto: any) {
    return this.subjectService.update(dto);
  }

  @Delete('')
  remove(@Query('id') id: string) {
    return this.subjectService.remove(id);
  }
}
