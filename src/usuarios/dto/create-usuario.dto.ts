import { IsString, IsInt, IsPositive } from "class-validator";

export class CreateUsuarioDto {
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

    @IsString()
    role: string
}
