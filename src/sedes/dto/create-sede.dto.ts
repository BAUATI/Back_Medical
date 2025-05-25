import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateSedeDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsString()
  direccion: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ciudad?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  departamento?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}
