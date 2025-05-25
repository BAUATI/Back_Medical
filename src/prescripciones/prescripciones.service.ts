import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrescripcioneDto } from './dto/create-prescripcione.dto';
import { UpdatePrescripcioneDto } from './dto/update-prescripcione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Prescripcione } from './entities/prescripcione.entity';
import { Repository } from 'typeorm';
import { HistoriaClinica } from 'src/historias-clinicas/entities/historia-clinica.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class PrescripcionesService {
  constructor(
    @InjectRepository(Prescripcione)
    private readonly prescripcioneRepository: Repository<Prescripcione>,

    @InjectRepository(HistoriaClinica)
    private readonly historiaClinica: Repository<HistoriaClinica>,
    private readonly usuarioRepository: UsuariosService,
  ) {}
  async create(dto: CreatePrescripcioneDto): Promise<Prescripcione> {
    const paciente = await this.usuarioRepository.findOne(dto.paciente_uid );
    const profesional = await this.usuarioRepository.findOne(dto.profesional_uid );
    const historia = await this.historiaClinica.findOneBy({ uid: dto.historia_clinica_uid });

    if (!paciente || paciente.rol !== 'PACIENTE') {
      throw new BadRequestException('Paciente inválido');
    }

    if (!profesional || profesional.rol !== 'PROFESIONAL') {
      throw new BadRequestException('Profesional inválido');
    }

    if (!historia) {
      throw new BadRequestException('Historia clínica no encontrada');
    }

    const prescripcion = this.prescripcioneRepository.create({
      medicamentos: dto.medicamentos,
      recomendaciones: dto.recomendaciones,
      paciente,
      profesional,
      historiaClinica: historia,
    });

    return await this.prescripcioneRepository.save(prescripcion);
  }

  async findAll(): Promise<Prescripcione[]> {
    return await this.prescripcioneRepository.find();
  }

  async findOne(uid: string): Promise<Prescripcione> {
    const prescripcion = await this.prescripcioneRepository.findOneBy({ uid });
    if (!prescripcion) {
      throw new NotFoundException('Prescripción no encontrada');
    }
    return prescripcion;
  }

  async update(uid: string, dto: UpdatePrescripcioneDto): Promise<Prescripcione> {
    const prescripcion = await this.prescripcioneRepository.findOneBy({ uid });
    if (!prescripcion) {
      throw new NotFoundException('Prescripción no encontrada');
    }

    if (dto.paciente_uid) {
      const paciente = await this.usuarioRepository.findOne(dto.paciente_uid );
      if (!paciente || paciente.rol !== 'PACIENTE') {
        throw new BadRequestException('Paciente inválido');
      }
      prescripcion.paciente = paciente;
    }

    if (dto.profesional_uid) {
      const profesional = await this.usuarioRepository.findOne(dto.profesional_uid );
      if (!profesional || profesional.rol !== 'PROFESIONAL') {
        throw new BadRequestException('Profesional inválido');
      }
      prescripcion.profesional = profesional;
    }

    if (dto.historia_clinica_uid) {
      const historia = await this.historiaClinica.findOneBy({ uid: dto.historia_clinica_uid });
      if (!historia) {
        throw new BadRequestException('Historia clínica no válida');
      }
      prescripcion.historiaClinica = historia;
    }

    if (dto.medicamentos !== undefined) {
      prescripcion.medicamentos = dto.medicamentos;
    }

    if (dto.recomendaciones !== undefined) {
      prescripcion.recomendaciones = dto.recomendaciones;
    }

    return await this.prescripcioneRepository.save(prescripcion);
  }

  async remove(uid: string): Promise<void> {
    const prescripcion = await this.prescripcioneRepository.findOneBy({ uid });
    if (!prescripcion) {
      throw new NotFoundException('Prescripción no encontrada');
    }
    await this.prescripcioneRepository.remove(prescripcion);
  }
}
