import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { MessageWsService } from './message-ws.service.js';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto.js';
import { AuthService } from '../auth/auth.service.js';
import { JwtPayload } from '../auth/interfaces/jwt-payload.js';

@WebSocketGateway({
  cors: true,
})
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,

    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    console.log('CLIENT CONNECTED:', client.id);

    // console.log(client)
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client,payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }

    console.log({payload})


    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectionClients(),
    );
    //     client.onAny((event, ...args) => {
    //   console.log('EVENTO RECIBIDO:', event, args)
    // })
  }

  handleDisconnect(client: Socket, reason?: string) {
    console.log('CLIENT DISCONNECTED:', client.id);
    console.log('REASON:', reason);

    this.messageWsService.removeClient(client.id);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectionClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: NewMessageDto,
  ) {
    //! Emit only at the client. Just One
    // client.emit('message-from-server',{
    //   fullName: 'Soy Yo',
    //   message: payload.message || 'no-message'
    // })
    //! Emit everyon except the original client
    // client.broadcast.emit('message-from-server',{
    //   fullName: 'Soy Yo',
    //   message: payload.message || 'no-message'
    // })

    //! Everyone
    this.wss.emit('message-from-server', {
      senderId: client.id,
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message',
    });
    return {
      received: true,
      payload,
    };
  }
}
