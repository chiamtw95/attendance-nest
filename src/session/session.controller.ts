import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  findOne(@Query('id') id: string) {
    console.log('gettt, ', id);
    return this.sessionService.findOne(id);
  }

  @Post('create')
  create(@Body() createSessionDto: any) {
    return this.sessionService.create(createSessionDto);
  }

  @Post('checkin')
  takeAttendance(@Body() dto: any) {
    console.log(dto);
    return this.sessionService.takeAttendance(dto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
  //   return this.sessionService.update(+id, updateSessionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sessionService.remove(+id);
  // }
}
