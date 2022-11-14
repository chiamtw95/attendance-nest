import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LecturerService } from './lecturer.service';

@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Post()
  register(@Body() dto: any) {
    return this.lecturerService.registerLecturer(dto);
  }

  @Get()
  findAll() {
    return this.lecturerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturerService.findOne(id);
  }

  @Post('passwordchange')
  update(@Body() dto: any) {
    return this.lecturerService.updatePW(dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.lecturerService.remove(+id);
  // }
}
