import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PersonajesModule } from './personajes/personajes.module';
import { BatallaModule } from './batalla/batalla.module';
import { BatallaSocketModule } from './batalla-socket/batalla-socket.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/batalla-friki'), 
    UsuariosModule, 
    AuthModule, 
    PersonajesModule, 
    BatallaModule, BatallaSocketModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
