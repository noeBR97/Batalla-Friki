import { IsString, IsInt, IsPositive } from "class-validator";

export class CreatePersonajeDto {
    @IsString()
    nombre: string

    @IsInt()
    @IsPositive()
    vida: number

    @IsInt()
    @IsPositive()
    ataque: number

    @IsInt()
    @IsPositive()
    nivel: number
}