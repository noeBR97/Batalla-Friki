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

  salas: Record<string, number> = {}
  @SubscribeMessage('unirse-batalla')
  async handleUnirse(@MessageBody() idBatalla: string, @ConnectedSocket() client: Socket) {
    client.join(idBatalla)

    const sala = this.io.sockets.adapter.rooms.get(idBatalla)
    const cantidad = sala ? sala.size : 0

    console.log(`Cliente ${client.id} unido a ${idBatalla}. Jugadores en sala: ${cantidad}`)

    this.io.to(idBatalla).emit('estado-sala', {
      jugadoresConectados: cantidad
    })

    if(cantidad === 2) {
      console.log(`Iniciando batalla ${idBatalla}`)

      this.io.to(idBatalla).emit('jugador-unido')

      await this.batallaService.ejecutarBatallaTiempoReal(idBatalla, this.io)
    }
  }

  @SubscribeMessage('iniciar-batalla')
  async handleIniciar(@MessageBody() data: {idBatalla: string}) {
    await this.batallaService.ejecutarBatallaTiempoReal(data.idBatalla, this.io)
  }
}
