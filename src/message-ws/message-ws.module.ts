import { Module } from '@nestjs/common';
import { MessageWsService } from './message-ws.service.js';
import { MessageWsGateway } from './message-ws.gateway.js';
import { AuthService } from '../auth/auth.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  providers: [MessageWsGateway, MessageWsService],
  imports : [ AuthModule]
})
export class MessageWsModule {}
