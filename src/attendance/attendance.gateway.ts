import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AttendanceService } from './attendance.service';

// @UseGuards(JwtGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class AttendanceGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly attendanceService: AttendanceService) {}

  @SubscribeMessage('wow')
  blah(@MessageBody() createAttendanceDto: any) {
    console.log('hahah');
  }

  @SubscribeMessage('newAttendance')
  async create(@MessageBody() createAttendanceDto: any) {
    console.log(createAttendanceDto);
    const { sessionId, studentName } = createAttendanceDto;
    await this.attendanceService.create(sessionId, studentName);
    const updatedAttendance = await this.attendanceService.findAll(sessionId);
    const filteredList = updatedAttendance?.map((x) => {
      return x?.name;
    });
    this.server.emit('newAttendance', filteredList);
  }

  @SubscribeMessage('findAllAttendance')
  async findAll(@MessageBody('sessionId') sessionId: string) {
    console.log('sessionid', sessionId);
    const allAttendance = await this.attendanceService.findAll(sessionId);
    const res = allAttendance.map((x) => {
      return x.name;
    });
    this.server.emit('findAllAttendance', res);

    return res;
  }

  @SubscribeMessage('removeAttendance')
  update(@MessageBody() removeAttendanceDto: any) {
    const { sessionId, studentId } = removeAttendanceDto;
    return this.attendanceService.removeAttendance(sessionId, studentId);
  }
}
// @SubscribeMessage('createSession')
// joinRoom(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
//   return this.attendanceService.createSession(payload, client.id);
// }
// TODO get all active sessions
// TODO create a session
