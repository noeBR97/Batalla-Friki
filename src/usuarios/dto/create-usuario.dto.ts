import { IsString, IsInt, IsPositive, IsIn } from "class-validator";

export class CreateUsuarioDto {
    @IsInt()
    @IsPositive()
    id: number

    @IsString()
    nombre: string

    @IsString()
    email: string

    @IsString()
    password: string

    @IsInt()
    nivel: number

    @IsInt()
    experiencia: number

    @IsInt()
    batallas_ganadas: number

    @IsInt()
    batallas_perdidas: number
}
