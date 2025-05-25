import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/auth/entities/user.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Cita } from 'src/citas/entities/cita.entity';
import { HistoriaClinica } from 'src/historias-clinicas/entities/historia-clinica.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Sede)
    private readonly sedeRepository: Repository<Sede>,

    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(HistoriaClinica)
    private readonly historiaClinicaRepository: Repository<HistoriaClinica>,
  ) {}

  async obtenerEstadisticas() {
    const pacientes = await this.usuarioRepository.count({ where: { rol: 'PACIENTE' } });
    const profesionales = await this.usuarioRepository.count({ where: { rol: 'PROFESIONAL' } });
    const administrativos = await this.usuarioRepository.count({ where: { rol: 'ADMINISTRATIVO' } });

    const sedes = await this.sedeRepository.count();

    const citasProgramadas = await this.citaRepository.count({ where: { estado: 'Programada' } });
    const citasCanceladas = await this.citaRepository.count({ where: { estado: 'Cancelada' } });

    const historiasClinicas = await this.historiaClinicaRepository.count();

    return {
      usuarios: {
        pacientes,
        profesionales,
        administrativos,
      },
      sedes,
      citas: {
        programadas: citasProgramadas,
        canceladas: citasCanceladas,
      },
      historias_clinicas: historiasClinicas,
    };
  }
}
