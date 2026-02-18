import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BatallaController } from './batalla.controller';
import { BatallaService } from './batalla.service';
import { Batalla, BatallaSchema } from './entities/batalla.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { PersonajesModule } from 'src/personajes/personajes.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BatallaController],
  providers: [BatallaService],
  imports: [
    MongooseModule.forFeature([
      { name: Batalla.name, schema: BatallaSchema }
    ]),
    UsuariosModule,
    PersonajesModule,
    AuthModule,
  ]
})
export class BatallaModule {}
