import { Module } from '@nestjs/common';
import { MessageWsService } from './message-ws.service.js';
import { MessageWsGateway } from './message-ws.gateway.js';

@Module({
  providers: [MessageWsGateway, MessageWsService],
})
export class MessageWsModule {}
