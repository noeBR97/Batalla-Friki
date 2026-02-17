import { Module } from '@nestjs/common';
import { PersonajesController } from './personajes.controller';
import { PersonajesService } from './personajes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Personaje, PersonajeSchema } from './entities/personaje.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PersonajesController],
  providers: [PersonajesService],
  imports: [
      MongooseModule.forFeature([
        {
          name: Personaje.name, //Nombre de la clase del modelo: 'Usuario'.
          schema: PersonajeSchema, //Esquema del modelo.
        },
      ]),
      AuthModule
    ]
})
export class PersonajesModule {}
