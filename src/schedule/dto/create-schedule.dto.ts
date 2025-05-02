import { IsString, MinLength, MaxLength, IsBoolean, IsOptional, IsUUID, Matches } from "class-validator";

export class CreateScheduleDto {
    @IsUUID()
    professionalId: string;

    @IsUUID()
    consultorioId: string;

    @IsString()
    @Matches(/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)$/, {
        message: 'dayOfWeek debe ser un día válido (Lunes, Martes, etc.)'
    })
    dayOfWeek: string;

    @IsString()
    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'startTime debe estar en formato HH:mm:ss (24 horas)'
    })
    startTime: string;

    @IsString()
    @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'endTime debe estar en formato HH:mm:ss (24 horas)'
    })
    endTime: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
