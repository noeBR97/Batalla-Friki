import { Module } from '@nestjs/common';
import { BatallaSocketGateway } from './batalla-socket.gateway';

@Module({
  providers: [BatallaSocketGateway]
})
export class BatallaSocketModule {}
