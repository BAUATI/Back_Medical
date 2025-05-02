import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ValidRols } from 'src/middlewares/menu-ros';
import { QueryAppointmentDto } from './dto/query-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Auth(ValidRols.paciente, ValidRols.administrativo)
  create(@Body() createAppointmentDto: CreateAppointmentDto, @GetUser() user: User) {
    return this.appointmentService.create(createAppointmentDto, user);
  }

  @Get()
  @Auth(ValidRols.administrativo, ValidRols.paciente, ValidRols.profesional)
  findAll(@Query() query: QueryAppointmentDto, @GetUser() user: User) {
    return this.appointmentService.findAll(query, user);
  }

  @Get(':id')
  @Auth(ValidRols.administrativo, ValidRols.paciente, ValidRols.profesional)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.appointmentService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(ValidRols.administrativo, ValidRols.paciente, ValidRols.profesional)
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto, @GetUser() user: User) {
    return this.appointmentService.update(id, updateAppointmentDto, user);
  }

  @Delete(':id')
  @Auth(ValidRols.administrativo, ValidRols.paciente, ValidRols.profesional)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.appointmentService.remove(id, user);
  }
}
