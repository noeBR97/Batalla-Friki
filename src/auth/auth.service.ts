import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService, 
        private jwtService: JwtService
    ) {}

    async register(data: RegisterDto): Promise<any> {
        try {
            const exists = await this.usuariosService.findEmail(data.email)
            if (exists) {
                throw new BadRequestException('El usuario ya existe')
            }

            const hashedPassword = await bcrypt.hash(data.password, 10)

            const user = await this.usuariosService.create({
                nombre: data.nombre,
                email: data.email,
                password: hashedPassword,
                nivel: 1,
                experiencia: 0,
                batallas_ganadas: 0,
                batallas_perdidas: 0,
                role: 'USER',
            })

            //devuelve el usuario dentro de result sin la contraseña y lo convierte a objeto si es un documento de Mongoose
            const { password, ...result } = user.toObject ? user.toObject() : user 
            return result
        } catch (error) {
            throw new BadRequestException(error.message || 'Error al registrar el usuario')
        }
    }

    async validateUser(email: string, pass: string) {
        try {
            const user = await this.usuariosService.findEmail(email);
            if(!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const ok = await bcrypt.compare(pass, user.password)
            if (!ok) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const { password, ...result } = user.toObject ? user.toObject() : user 
            return result
        } catch (error) {
            throw new UnauthorizedException(error.message || 'Error al validar el usuario')
        }
    }

    async login(user: any) {
        try {
            const payload = { email: user.email, sub: user._id, role: user.role };
            return {
            access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            throw new UnauthorizedException(error.message || 'Error al iniciar sesión')
        }
    }
}

