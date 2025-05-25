import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Get()
  findAll() {
    return this.citasService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.citasService.findOne(uid);
  }

  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(uid, updateCitaDto);
  }

  @Patch(':uid')
  cancelar(@Param('uid') uid: string) {
    return this.citasService.cancelar(uid);
  }
}
