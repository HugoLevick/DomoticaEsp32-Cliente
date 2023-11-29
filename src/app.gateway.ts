import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { AppService } from './app.service';
import { Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
  ) {}

  handleConnection(socket: Socket): void {
    this.appService.handleConnection(socket);
  }

  @SubscribeMessage('message')
  message(@MessageBody() data: string) {
    console.log(data);
    return 'Hello world!';
  }

  emitLedUpdate(ledName: string, state: boolean) {
    this.server.emit('ledUpdate', { ledName, state });
  }
}
