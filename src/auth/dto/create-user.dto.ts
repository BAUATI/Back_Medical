import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsJSON,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  rol?: string;

  @ApiProperty()
  @IsString({
    message: "El nombre es campo requerido",
  })
  nombre: string;

  @ApiProperty()
  @IsString({
    message: "El sexo es campo requerido",
  })
  @IsOptional()
  sexo?: string;

  @ApiProperty()
  @IsString({
    message: "La fecha de nacimiento es campo requerido",
  })
  @IsOptional()
  fecha_nacimiento?: string;

  @ApiProperty()
  @IsString({
    message: "La fecha de ingreso es campo requerido",
  })
  @IsOptional()
  fecha_ingreso?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  registro?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  especialidad?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  registro_profesional?: string;

  @ApiProperty()
  @IsString()
  cedula: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty()
  @IsString({
    message: "El username debe ser una cadena de texto",
  })
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsString({
    message: "El correo es obligatorio",
  })
  correo: string;

  @ApiProperty()
  @IsString({
    message: "La direccion debe ser una cadena de texto",
  })
  @IsOptional()
  direccion?: string;

  @ApiProperty()
  @IsString({
    message: "La direccion debe ser una cadena de texto",
  })
  @IsOptional()
  eps?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cargo?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  creado_por?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  modificado_por?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  isEstado?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  estado?: boolean;

  @ApiProperty({
    description: "ID de la sede a la que pertenece el usuario",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  sedeId?: string;
}
