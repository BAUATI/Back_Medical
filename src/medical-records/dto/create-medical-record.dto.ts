import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  professionalId: string;

  @IsUUID()
  appointmentId: string;

  @IsString()
  diagnosis: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}