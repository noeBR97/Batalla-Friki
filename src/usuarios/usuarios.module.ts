import { Module, forwardRef } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UsuarioSchema, Usuario } from './entities/usuario.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  exports: [UsuariosService],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      {
        name: Usuario.name, //Nombre de la clase del modelo: 'Usuario'.
        schema: UsuarioSchema, //Esquema del modelo.
      },
    ]),
  ],
})
export class UsuariosModule {}

