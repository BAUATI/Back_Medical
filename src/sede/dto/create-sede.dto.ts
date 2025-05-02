import { IsString, MinLength, MaxLength, IsBoolean, IsOptional } from "class-validator";

export class CreateSedeDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(5)
    @MaxLength(255)
    address: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    city: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
