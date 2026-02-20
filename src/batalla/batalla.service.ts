import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { StartBatallaDto } from './dto/start-batalla.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Model } from 'mongoose';
import { Personaje } from 'src/personajes/entities/personaje.entity';
import { Batalla } from './entities/batalla.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { PersonajesService } from 'src/personajes/personajes.service';
import { Server } from 'socket.io';

@Injectable()
export class BatallaService {
    constructor(
        @InjectModel(Batalla.name)
        private readonly batallaModel: Model<Batalla>,

        private personajeService: PersonajesService,

        private usuarioService: UsuariosService
    ) {}

    async startBatalla(usuarioId: string, dto: StartBatallaDto) {
        //obtenemos atacante
        const usuario1 = await this.usuarioService.findOne(usuarioId.toString())
        if(!usuario1) {
            throw new NotFoundException('Usuario no encontrado')
        }

        const personaje1 = await this.personajeService.findOne(dto.idPersonaje.toString())
        if(!personaje1) {
            throw new NotFoundException('Personaje no encontrado')
        }

        //validamos el nivel del usuario con el del personaje que quiere usar
        if(usuario1.nivel < personaje1.nivel) {
            throw new ForbiddenException('Nivel insuficiente para usar ese personaje')
        }

        //obtenemos oponente
        const usuario2 = await this.usuarioService.findOne(dto.idUsuarioOponente)
        if(!usuario2) {
            throw new NotFoundException('Oponente no encontrado')
        }

        const personaje2 = await this.personajeService.findOne(dto.idPersonajeOponente)
        if(!personaje2) {
            throw new NotFoundException('Personaje del oponente no encontrado')
        }

        //validamos nivel del oponente
        if(usuario2.nivel < personaje2.nivel) {
            throw new ForbiddenException('El oponente tiene nivel insuficiente para usar ese personaje')
        }

        //creamos la batalla
        const batalla = await this.batallaModel.create({
            usuario1: usuario1._id,
            usuario2: usuario2._id,
            personaje1: personaje1._id,
            personaje2: personaje2._id,
            vida_actual_personaje1: personaje1.vida,
            vida_actual_personaje2: personaje2.vida,
            estado: 'EN PROGRESO',
            logs: []
        })

        return batalla
    }

    async ejecutarBatallaTiempoReal(idBatalla: string, io: Server) {
        const batalla = await this.batallaModel.findById(idBatalla)
            .populate('personaje1')
            .populate('personaje2')

        if(!batalla) {
            throw new NotFoundException('Batalla no encontrada')
        }

        const p1 = batalla.personaje1 as Personaje
        const p2 = batalla.personaje2 as Personaje

        let vidaP1 = p1.vida
        let vidaP2 = p2.vida
        const logs: string[] = []

        while (vidaP1 > 0 && vidaP2 > 0) {
            await new Promise(res => setTimeout(res, 1500)) //hacemos una espera de 1,5 segundos

            //golpea p1
            vidaP2 = Math.max(vidaP2 - p1.ataque, 0) //si se queda en negativo, lo deja en 0

            const log1 = `Personaje 1 golpea y deja a Personaje 2 en ${vidaP2}`
            logs.push(log1)

            io.to(idBatalla).emit('turno', {
                atacante: 'P1',
                vidaRestante: vidaP2
            })

            if(vidaP2 <= 0) break

            await new Promise(res => setTimeout(res, 1500))

            //golpea p2
            vidaP1 = Math.max(vidaP1 - p2.ataque, 0)

            const log2 = `Personaje 2 golpea y deja a Personaje 1 en ${vidaP1}`
            logs.push(log2)

            io.to(idBatalla).emit('turno', {
                atacante: 'P2',
                vidaRestante: vidaP1
            })
        }

        //validamos ganador
        const ganador = vidaP1 > 0 ? batalla.usuario1 : batalla.usuario2

        //aplicamos cambios del resultado de la batalla
        batalla.vida_actual_personaje1 = vidaP1
        batalla.vida_actual_personaje2 = vidaP2
        batalla.estado = 'FINALIZADA'
        batalla.ganador = ganador
        batalla.logs = logs

        await batalla.save()

        //actualizamos experiencia del usuario
        if(ganador.toString() === batalla.usuario1.toString()) {
            await this.usuarioService.addExperiencia(batalla.usuario1.toString(), 10)
        } else {
            await this.usuarioService.addExperiencia(batalla.usuario2.toString(), 10)
        }

        io.to(idBatalla).emit('fin-batalla', {
            ganador
        })

        return batalla
    }

    async findAllAbiertas() {
        return this.batallaModel.find({ estado: 'EN PROGRESO' })
    }
}
