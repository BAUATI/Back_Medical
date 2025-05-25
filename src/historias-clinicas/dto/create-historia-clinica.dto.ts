import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateHistoriaClinicaDto {
  @ApiProperty()
  @IsUUID()
  paciente_uid: string;

  @ApiProperty()
  @IsUUID()
  profesional_uid: string;

  @ApiProperty()
  @IsDateString()
  fecha: Date;

  @ApiProperty()
  @IsString()
  motivo_consulta: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  antecedentes?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  diagnostico?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tratamiento?: string;
}
