import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonajeDto } from './create-personaje.dto';

export class UpdatePersonajeDto extends PartialType(CreatePersonajeDto) {}