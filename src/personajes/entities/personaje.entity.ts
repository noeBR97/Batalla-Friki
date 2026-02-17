import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema({ collection: 'personajes' })
export class Personaje extends Document {
    @Prop({ required: true })
    nombre: string

    @Prop({ required: true })
    vida: number

    @Prop({ required: true })
    ataque: number

    @Prop({ required: true })
    nivel: number
}

export const PersonajeSchema = SchemaFactory.createForClass(Personaje)
PersonajeSchema.set('versionKey', false)