import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horariosService.create(createHorarioDto);
  }

  @Get()
  findAll() {
    return this.horariosService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.horariosService.findOne(uid);
  }

  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horariosService.update(uid, updateHorarioDto);
  }

  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.horariosService.remove(uid);
  }
}
