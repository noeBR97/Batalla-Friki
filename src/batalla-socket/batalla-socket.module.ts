import { Module } from '@nestjs/common';
import { BatallaSocketGateway } from './batalla-socket.gateway';
import { BatallaModule } from 'src/batalla/batalla.module';

@Module({
  providers: [BatallaSocketGateway],
  imports: [BatallaModule]
})
export class BatallaSocketModule {}
