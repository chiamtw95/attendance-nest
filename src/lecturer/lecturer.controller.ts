import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { LecturerService } from './lecturer.service';

@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  // @Post()
  // // create(@Body() createLecturerDto: CreateLecturerDto) {
  // //   return this.lecturerService.create(createLecturerDto);
  // // }

  @Get()
  findAll() {
    return this.lecturerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturerService.findOne(id);
  }

  @Patch('passwordchange')
  update(@Body() dto: any) {
    console.log(dto);
    return this.lecturerService.updatePW(dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.lecturerService.remove(+id);
  // }
}
