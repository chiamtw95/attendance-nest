import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AttendanceService } from './attendance.service';

// @UseGuards(JwtGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class AttendanceGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly attendanceService: AttendanceService) {}

  @SubscribeMessage('joinRoom')
  assigntClientToRoom(
    @MessageBody() dto: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(dto.roomName);
  }

  @SubscribeMessage('newAttendance')
  async create(@MessageBody() createAttendanceDto: any) {
    const { sessionId, studentName } = createAttendanceDto;
    const res: any = await this.attendanceService.takeAttendance(
      sessionId,
      studentName,
    );
    const updatedAttendance = await this.attendanceService.findAll(sessionId);
    const filteredList = updatedAttendance?.map((x) => {
      return x?.name;
    });
    res && this.server.to(sessionId).emit('error', res);
    this.server.to(sessionId).emit('newAttendance', filteredList);
  }

  @SubscribeMessage('findAllAttendance')
  async findAll(
    @MessageBody('sessionId') sessionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const allAttendance = await this.attendanceService.findAll(sessionId);
    const res = allAttendance.map((x) => {
      return x.name;
    });
    this.server.to(client.id).emit('findAllAttendance', res);

    return res;
  }

  // @SubscribeMessage('removeAttendance')
  // update(@MessageBody() removeAttendanceDto: any) {
  //   const { sessionId, studentId } = removeAttendanceDto;
  //   return this.attendanceService.removeAttendance(sessionId, studentId);
  // }
}
