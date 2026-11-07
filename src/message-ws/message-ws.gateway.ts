import { OnGatewayConnection, OnGatewayDisconnect,WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service.js';
import { Socket, Server } from 'socket.io';

@WebSocketGateway( { cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss : Server
  constructor(
    private readonly messageWsService: MessageWsService
  ) {}
  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client)
    this.wss.emit('clients-updated', this.messageWsService.getConnectionClients())
    
  }
  handleDisconnect(client: Socket, reason?: string) {
    this.messageWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messageWsService.getConnectionClients())

  }
}
