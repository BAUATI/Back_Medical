import { IsString, MinLength, MaxLength, IsBoolean, IsOptional, IsUUID } from "class-validator";

export class CreateConsultorioDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean;

    @IsUUID()
    sedeId: string;

    @IsUUID()
    @IsOptional()
    professionalId?: string;
}
