import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { HistoriasClinicasService } from "./historias-clinicas.service";
import { CreateHistoriaClinicaDto } from "./dto/create-historia-clinica.dto";
import { UpdateHistoriaClinicaDto } from "./dto/update-historia-clinica.dto";

@Controller("historias-clinicas")
export class HistoriasClinicasController {
  constructor(
    private readonly historiasClinicasService: HistoriasClinicasService
  ) {}

  @Post()
  create(@Body() createHistoriaClinicaDto: CreateHistoriaClinicaDto) {
    return this.historiasClinicasService.create(createHistoriaClinicaDto);
  }

  @Get()
  findAll() {
    return this.historiasClinicasService.findAll();
  }

  @Get(":uid")
  findOne(@Param("uid") uid: string) {
    return this.historiasClinicasService.findOne(uid);
  }

  @Patch(":uid")
  update(
    @Param("uid") uid: string,
    @Body() updateHistoriaClinicaDto: UpdateHistoriaClinicaDto
  ) {
    return this.historiasClinicasService.update(uid, updateHistoriaClinicaDto);
  }

  @Delete(":uid")
  remove(@Param("uid") uid: string) {
    return this.historiasClinicasService.remove(uid);
  }

  @Patch(":uid/estado")
  async cambiarEstado(@Param("uid") uid: string) {
    return this.historiasClinicasService.cambiarEstado(uid);
  }
}
