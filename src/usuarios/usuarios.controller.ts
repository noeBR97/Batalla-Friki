import { Controller, Get, Post, Body, Patch, Put, Param, Delete, ParseIntPipe,ValidationPipe, UsePipes, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Validate } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt.strategy/jwt-auth.guard';
import { SetMetadata } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// Decorador para roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('users')
@UseGuards(JwtAuthGuard)
@UsePipes(ValidationPipe) // Se aplica a todos los métodos del controlador
// @UsePipes(new ValidationPipe({  //Validación global
//           whitelist: true, //Rechaza campos no definidos en el DTO
//           forbidNonWhitelisted: true, //Lanza un error si hay campos extra
//           transform: true //Convierte tipos automáticamente
//       })) // Se aplica a todos los métodos del controlador

export class UsuariosController {
  constructor(private readonly usersService: UsuariosService) {}

  @Post()
  @Roles('admin')
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUsuarioDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)  // Cambia el código de estado de la respuesta
  findOne(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  //@UsePipes(ValidationPipe)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUsuarioDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

