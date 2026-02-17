import { Injectable } from '@nestjs/common';
import { Personaje } from './entities/personaje.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePersonajeDto } from './dto/create-personaje.dto';
import { UpdatePersonajeDto } from './dto/update-personaje.dto';

@Injectable()
export class PersonajesService {
    constructor(
        @InjectModel(Personaje.name)
        private readonly personajeModel: Model<Personaje>
    ) {}

    create(data: CreatePersonajeDto) {
        return this.personajeModel.create(data)
    }

    findAll() {
        return this.personajeModel.find()
    }

    findOne(id: string) {
        return this.personajeModel.findById(id)
    }

    update(id: string, data: UpdatePersonajeDto) {
        return this.personajeModel.findByIdAndUpdate(id, data, {new: true})
    }

    remove(id: string) {
        return this.personajeModel.findByIdAndDelete(id)
    }
}
