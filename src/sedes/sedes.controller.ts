import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post()
  create(@Body() createSedeDto: CreateSedeDto) {
    return this.sedesService.create(createSedeDto);
  }

  @Get()
  findAll() {
    return this.sedesService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.sedesService.findOne(uid);
  }

  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateSedeDto: UpdateSedeDto) {
    return this.sedesService.update(uid, updateSedeDto);
  }

  @Patch(':uid')
  desactivar(@Param('uid') uid: string) {
    return this.sedesService.desactivar(uid);
  }
}
