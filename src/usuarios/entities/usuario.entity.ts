import { Document } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema({ collection: 'usuarios' })
export class Usuario extends Document { 
    @Prop({ unique: true, index: true })
    id: number

    @Prop({ required: true })
    nombre: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop()
    nivel: number

    @Prop()
    experiencia: number

    @Prop()
    batallas_ganadas: number

    @Prop()
    batallas_perdidas: number
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario)
UsuarioSchema.set('versionKey', false)
