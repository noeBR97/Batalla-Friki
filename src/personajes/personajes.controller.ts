import { Controller, UseGuards, Get, Post, Body, Patch, Put, Param, Delete, ParseIntPipe,ValidationPipe, UsePipes, HttpCode, HttpStatus, } from '@nestjs/common';
import { PersonajesService } from './personajes.service';
import { JwtAuthGuard } from 'src/auth/jwt.strategy/jwt-auth.guard';
import { Roles } from 'src/usuarios/usuarios.controller';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreatePersonajeDto } from './dto/create-personaje.dto';
import { UpdatePersonajeDto } from './dto/update-personaje.dto';


@Controller('personajes')
export class PersonajesController {
    constructor (private readonly personajesService: PersonajesService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.personajesService.findAll()
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.personajesService.findOne(id)
    }

    @Post()
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() body: CreatePersonajeDto) {
        return this.personajesService.create(body)
    }

    @Put(':id')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(@Param('id') id: string, @Body() body: UpdatePersonajeDto) {
        return this.personajesService.update(id, body)
    }

    @Delete(':id')
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param('id') id: string) {
        return this.personajesService.remove(id)
    }
}
