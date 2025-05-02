import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe, Query } from '@nestjs/common';
import { SedeService } from './sede.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRols } from 'src/auth/interfaces/valid-rols';
import { Sede } from './entities/sede.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateConsultorioDto } from 'src/consultorio/dto/create-consultorio.dto';
import { UpdateConsultorioDto } from 'src/consultorio/dto/update-consultorio.dto';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';
import { UpdateScheduleDto } from 'src/schedule/dto/update-schedule.dto';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Controller('sede')
export class SedeController {
  constructor(private readonly sedeService: SedeService) {}

  @Post()
  @Auth(ValidRols.administrativo)
  createSede(@Body() createSedeDto: CreateSedeDto): Promise<Sede> {
    return this.sedeService.createSede(createSedeDto);
  }

  @Get()
  @Auth(ValidRols.administrativo)
  findAllSedes(@Query() paginationDto: PaginationDto): Promise<Sede[]> {
    return this.sedeService.findAllSedes(paginationDto);
  }

  @Get(':id')
  @Auth(ValidRols.administrativo)
  findOneSede(@Param('id', ParseUUIDPipe) id: string): Promise<Sede> {
    return this.sedeService.findOneSede(id);
  }

  @Patch(':id')
  @Auth(ValidRols.administrativo)
  updateSede(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSedeDto: UpdateSedeDto
  ): Promise<Sede> {
    return this.sedeService.updateSede(id, updateSedeDto);
  }

  @Delete(':id')
  @Auth(ValidRols.administrativo)
  @HttpCode(HttpStatus.OK)
  removeSede(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.sedeService.removeSede(id);
  }

  // --- Consultorios ---

  @Post('consultorios')
  @Auth(ValidRols.administrativo)
  createConsultorio(@Body() createConsultorioDto: CreateConsultorioDto): Promise<Consultorio> {
    return this.sedeService.createConsultorio(createConsultorioDto);
  }

  @Get('consultorios')
  @Auth(ValidRols.administrativo)
  findAllConsultorios(
    @Query() paginationDto: PaginationDto,
    @Query('id') id?: string
  ): Promise<Consultorio[]> {
    return this.sedeService.findAllConsultorios(paginationDto, id);
  }

  @Get('consultorios/:id')
  @Auth(ValidRols.administrativo)
  findOneConsultorio(@Param('id', ParseUUIDPipe) id: string): Promise<Consultorio> {
    return this.sedeService.findOneConsultorio(id);
  }

  @Patch('consultorios/:id')
  @Auth(ValidRols.administrativo)
  updateConsultorio(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConsultorioDto: UpdateConsultorioDto
  ): Promise<Consultorio> {
    return this.sedeService.updateConsultorio(id, updateConsultorioDto);
  }

  @Delete('consultorios/:id')
  @Auth(ValidRols.administrativo)
  @HttpCode(HttpStatus.OK)
  removeConsultorio(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.sedeService.removeConsultorio(id);
  }

  // --- Horarios (Schedules) ---

  @Post('schedules')
  @Auth(ValidRols.administrativo)
  createSchedule(@Body() createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return this.sedeService.createSchedule(createScheduleDto);
  }

  @Get('schedules')
  @Auth(ValidRols.administrativo)
  findAllSchedules(
    @Query() paginationDto: PaginationDto,
    @Query('professionalId') professionalId?: string,
    @Query('consultorioId') consultorioId?: string
  ): Promise<Schedule[]> {
    return this.sedeService.findAllSchedules(paginationDto, professionalId, consultorioId);
  }

  @Get('schedules/:id')
  @Auth(ValidRols.administrativo)
  findOneSchedule(@Param('id', ParseUUIDPipe) id: string): Promise<Schedule> {
    return this.sedeService.findOneSchedule(id);
  }

  @Patch('schedules/:id')
  @Auth(ValidRols.administrativo)
  updateSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto
  ): Promise<Schedule> {
    return this.sedeService.updateSchedule(id, updateScheduleDto);
  }

  @Delete('schedules/:id')
  @Auth(ValidRols.administrativo)
  @HttpCode(HttpStatus.OK)
  removeSchedule(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.sedeService.removeSchedule(id);
  }

}
