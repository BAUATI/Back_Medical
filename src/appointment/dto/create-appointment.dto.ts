import { IsUUID, IsOptional, IsDateString, IsString, IsIn, IsBoolean } from "class-validator";

export class CreateAppointmentDto {
    @IsUUID()
  patientId: string;

  @IsUUID()
  professionalId: string;

  @IsUUID()
  consultorioId: string;

  @IsUUID()
  @IsOptional()
  scheduleId?: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsIn(['PROGRAMADA', 'CONFIRMADA'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
