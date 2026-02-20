import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<Usuario>
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.usuarioModel.create(createUsuarioDto)
    } catch (error) {
        if (error.code === 11000) {
          throw new BadRequestException('El id de usuario ya existe')
        }
      throw new InternalServerErrorException('Error al crear el usuario - Revisar logs')
    }
  }

  async findEmail(email: string) {
    try {
      return await this.usuarioModel.findOne({email}).lean()
    } catch (error) {
      throw new InternalServerErrorException('Error al encontrar el email - Revisar logs')
    }
  }

  findAll() {
    return this.usuarioModel.find({}, '-password')
  }

  findOne(id: string) {
    return this.usuarioModel.findById(id)
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  async addExperiencia(id: string, xp: number) {
    const usuario = await this.usuarioModel.findById(id)

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    usuario.experiencia = usuario.experiencia + xp

    //subida de nivel
    while(usuario.experiencia >= 100) {
      usuario.experiencia = usuario.experiencia - 100
      usuario.nivel = usuario.nivel + 1
    }

    await usuario.save()

    return usuario
  }

  async findMe(id: string) {
    const usuario = await this.usuarioModel.findById(id)

    if(!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    const { password, ...result } = usuario.toObject()
    return result
  }
}
