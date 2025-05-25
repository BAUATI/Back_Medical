import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HistoriaClinica } from "./entities/historia-clinica.entity";
import { CreateHistoriaClinicaDto } from "./dto/create-historia-clinica.dto";
import { UpdateHistoriaClinicaDto } from "./dto/update-historia-clinica.dto";
import { UsuariosService } from "src/usuarios/usuarios.service";

@Injectable()
export class HistoriasClinicasService {
  constructor(
    @InjectRepository(HistoriaClinica)
    private readonly historiaClinicaRepository: Repository<HistoriaClinica>,
    private readonly usuariosService: UsuariosService
  ) {}

  async create(dto: CreateHistoriaClinicaDto): Promise<HistoriaClinica> {
    const paciente = await this.usuariosService.findOne(dto.paciente_uid);
    const profesional = await this.usuariosService.findOne(dto.profesional_uid);

    if (!paciente || paciente.rol !== "PACIENTE") {
      throw new BadRequestException("Paciente inválido o con rol incorrecto");
    }

    if (!profesional || profesional.rol !== "PROFESIONAL") {
      throw new BadRequestException("Profesional inválido o con rol incorrecto");
    }

    // Verificar si ya existe una historia clínica para este paciente
    const historiaExistente = await this.historiaClinicaRepository.findOne({
      where: { paciente: { uid: dto.paciente_uid } },
    });

    if (historiaExistente) {
      throw new BadRequestException("Este paciente ya tiene una historia clínica registrada");
    }

    try {
      const historia = this.historiaClinicaRepository.create({
        ...dto,
        paciente,
        profesional,
      });
      await this.historiaClinicaRepository.save(historia);
      return historia;
    } catch (error) {
      console.error("Error al crear historia clínica:", error);
      throw new BadRequestException("No se pudo crear la historia clínica");
    }
  }

  async findAll(): Promise<HistoriaClinica[]> {
    return this.historiaClinicaRepository.find();
  }

  async findOne(uid: string): Promise<HistoriaClinica> {
    try {
      return await this.historiaClinicaRepository.findOneOrFail({ where: { uid } });
    } catch {
      throw new NotFoundException("Historia clínica no encontrada");
    }
  }

  async update(
    uid: string,
    dto: UpdateHistoriaClinicaDto
  ): Promise<HistoriaClinica> {
    const historia = await this.historiaClinicaRepository.findOneBy({ uid });
    if (!historia) {
      throw new NotFoundException("Historia clínica no encontrada");
    }

    const actualizada = this.historiaClinicaRepository.merge(historia, dto);

    try {
      await this.historiaClinicaRepository.save(actualizada);
      return actualizada;
    } catch (error) {
      console.error("Error al actualizar historia clínica:", error);
      throw new BadRequestException("No se pudo actualizar la historia clínica");
    }
  }

  async remove(uid: string): Promise<void> {
    const historia = await this.historiaClinicaRepository.findOneBy({ uid });
    if (!historia) {
      throw new NotFoundException("Historia clínica no encontrada");
    }
    try {
      await this.historiaClinicaRepository.remove(historia);
    } catch (error) {
      console.error("Error al eliminar historia clínica:", error);
      throw new BadRequestException("No se pudo eliminar la historia clínica");
    }
  }

  async cambiarEstado(uid: string): Promise<{ mensaje: string }> {
  const historia = await this.historiaClinicaRepository.findOneBy({ uid });

  if (!historia) {
    throw new NotFoundException(`Historia clínica con ID ${uid} no encontrada`);
  }

  const nuevoEstado = historia.estado === "Diagnosticado" ? "Atendido" : "Diagnosticado";

  try {
    await this.historiaClinicaRepository.update(uid, { estado: nuevoEstado });
    return { mensaje: `Historia clínica actualizada a estado: ${nuevoEstado}` };
  } catch (error) {
    console.error("Error al cambiar estado de historia clínica:", error);
    throw new BadRequestException("No se pudo actualizar el estado de la historia clínica");
  }
}
}
