import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsArray()
    @IsOptional()
    rols?: string[];

    @IsString()
    @IsOptional()
    documentId?: string;

    @IsString()
    @IsOptional()
    birthDate?: string; 

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    healthCoverage?: string;

    @IsString()
    @IsOptional()
    specialty?: string;

    @IsString()
    @IsOptional()
    medicalLicense?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}