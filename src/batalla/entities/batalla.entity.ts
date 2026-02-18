import mongoose, { Document, Types } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema({ collection: 'batallas' })
export class Batalla extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true })
    usuario1: Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }) //puede ser null si es contra la máquina
    usuario2: Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Personaje', required: true })
    personaje1: Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Personaje', required: true })
    personaje2: Types.ObjectId

    @Prop()
    vida_actual_personaje1: number

    @Prop()
    vida_actual_personaje2: number

    @Prop({ default: 'EN PROGRESO' })
    estado: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
    ganador: Types.ObjectId

    @Prop({ type: [String], default: [] })
    logs: string[]
}

export const BatallaSchema = SchemaFactory.createForClass(Batalla)
BatallaSchema.set('versionKey', false)