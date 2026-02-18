import { IsOptional, IsString } from "class-validator";

export class StartBatallaDto {
    @IsString()
    idUsuarioOponente: string

    @IsString()
    idPersonaje: string

    @IsString()
    idPersonajeOponente: string 
}