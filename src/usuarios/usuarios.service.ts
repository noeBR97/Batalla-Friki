import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
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
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
