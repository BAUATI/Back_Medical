import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class QueryAppointmentDto {
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @IsUUID()
  @IsOptional()
  professionalId?: string;

  @IsUUID()
  @IsOptional()
  consultorioId?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  limit?: number = 10;

  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}