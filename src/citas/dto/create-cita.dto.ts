import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateCitaDto {
  @ApiProperty()
  @IsUUID()
  paciente_uid: string;

  @ApiProperty()
  @IsUUID()
  profesional_uid: string;

  @ApiProperty()
  @IsUUID()
  sede_uid: string;

  @ApiProperty()
  @IsDateString()
  fecha_hora: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  motivo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  estado?: string;
}
