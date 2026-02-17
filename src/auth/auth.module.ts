import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtAuthGuard } from './jwt.strategy/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => UsuariosModule), //como authmodule importa usuariosmodule y usuariosmodule importa authmodule, hay que resolverlo asi
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', //Usa variables de entorno en producción.
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard], //Exportamos para que UsersModule pueda usarlo.
})
export class AuthModule {}

