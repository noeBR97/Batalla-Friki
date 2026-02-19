import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { BatallaService } from 'src/batalla/batalla.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Permitir todos los dominios
    methods: ['GET','POST'],
  }
})

@Injectable()
export class BatallaSocketGateway {
  @WebSocketServer()
  io: Server

  constructor(private readonly batallaService: BatallaService) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`)
  }

  @SubscribeMessage('unirse-batalla')
  async handleUnirse(@MessageBody() idBatalla: string, @ConnectedSocket() client: Socket) {
    client.join(idBatalla)
    return {msg: 'Unido a batalla'}
  }

  @SubscribeMessage('iniciar-batalla')
  async handleIniciar(@MessageBody() data: {idBatalla: string}) {
    await this.batallaService.ejecutarBatallaTiempoReal(data.idBatalla, this.io)
  }
}
