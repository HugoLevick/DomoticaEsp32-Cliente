import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AuthGateway {
  @WebSocketServer()
  private server: Server;

  emitAlarm(alarm: string) {
    this.server.emit('alarm', alarm);
  }
}
