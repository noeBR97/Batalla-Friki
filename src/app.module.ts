import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PersonajesModule } from './personajes/personajes.module';
import { BatallaModule } from './batalla/batalla.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/batalla-friki'), 
    UsuariosModule, 
    AuthModule, 
    PersonajesModule, 
    BatallaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
