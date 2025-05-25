import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsString, IsOptional } from "class-validator";

export class CreatePrescripcioneDto {

  @ApiProperty()
  @IsUUID()
  paciente_uid: string;

  @ApiProperty()
  @IsUUID()
  profesional_uid: string;

  @ApiProperty()
  @IsUUID()
  historia_clinica_uid: string;

  @ApiProperty()
  @IsString()
  medicamentos: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  recomendaciones?: string;
}
