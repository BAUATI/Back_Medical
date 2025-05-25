import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class LoginUserDto {

    @ApiProperty()
    @IsString()
    correo: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    password?: string;

}
