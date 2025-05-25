import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateHorarioDto {
  @ApiProperty()
  @IsUUID()
  profesional_uid: string;

  @ApiProperty()
  @IsString()
  fecha: string;

  @ApiProperty()
  @IsString()
  hora_inicio: string;

  @ApiProperty()
  @IsString()
  hora_fin: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
