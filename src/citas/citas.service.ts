import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThan } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { SedesService } from '../sedes/sedes.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { addMinutes } from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    private readonly usuariosService: UsuariosService,
    private readonly sedesService: SedesService,
  ) {}
@Cron(CronExpression.EVERY_10_MINUTES)
async create(createCitaDto: CreateCitaDto): Promise<Cita> {
  const { paciente_uid, profesional_uid, sede_uid, fecha_hora } = createCitaDto;

  const paciente = await this.usuariosService.findOne(paciente_uid);
  const profesional = await this.usuariosService.findOne(profesional_uid);
  const sede = await this.sedesService.findOne(sede_uid);

  if (!paciente || paciente.rol !== 'PACIENTE') {
    throw new BadRequestException('Paciente inválido o no es del rol PACIENTE');
  }

  if (!profesional || profesional.rol !== 'PROFESIONAL') {
    throw new BadRequestException('Profesional inválido o no es del rol PROFESIONAL');
  }

  // Rango de 30 minutos
  const start = new Date(fecha_hora);
  const end = addMinutes(start, 30);

  // Validar si el paciente ya tiene cita en ese rango
  const citaPaciente = await this.citaRepository
    .createQueryBuilder('cita')
    .where('cita.paciente_uid = :paciente_uid', { paciente_uid })
    .andWhere('cita.fecha_hora BETWEEN :start AND :end', { start, end })
    .getOne();

  if (citaPaciente) {
    throw new BadRequestException('El paciente ya tiene una cita agendada dentro de ese horario');
  }

  // Validar si el profesional ya tiene cita en ese rango
  const citaProfesional = await this.citaRepository
    .createQueryBuilder('cita')
    .where('cita.profesional_uid = :profesional_uid', { profesional_uid })
    .andWhere('cita.fecha_hora BETWEEN :start AND :end', { start, end })
    .getOne();

  if (citaProfesional) {
    throw new BadRequestException('El profesional ya tiene una cita agendada dentro de ese horario');
  }

  try {
    const cita = this.citaRepository.create({
      ...createCitaDto,
      paciente,
      profesional,
      sede,
      estado: 'Programada',
    });

    return await this.citaRepository.save(cita);
  } catch (error) {
    console.error(error);
    throw new BadRequestException('No se pudo crear la cita');
  }
}


  async findAll(): Promise<Cita[]> {
    return this.citaRepository.find();
  }

  async findOne(uid: string): Promise<Cita> {
    const cita = await this.citaRepository.findOneBy({ uid });
    if (!cita) {
      throw new NotFoundException('Cita no encontrada');
    }
    return cita;
  }

  async update(uid: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(uid);

    const { fecha_hora, profesional_uid, paciente_uid } = updateCitaDto;

    if (fecha_hora && profesional_uid) {
      const conflictoProfesional = await this.citaRepository.findOne({
        where: {
          profesional: { uid: profesional_uid },
          fecha_hora,
          uid: Not(uid),
        },
      });
      if (conflictoProfesional) {
        throw new BadRequestException('El profesional no está disponible en la nueva fecha y hora');
      }
    }

    if (fecha_hora && paciente_uid) {
      const conflictoPaciente = await this.citaRepository.findOne({
        where: {
          paciente: { uid: paciente_uid },
          fecha_hora,
          uid: Not(uid),
        },
      });
      if (conflictoPaciente) {
        throw new BadRequestException('El paciente ya tiene una cita en la nueva fecha y hora');
      }
    }

    const actualizada = this.citaRepository.merge(cita, updateCitaDto);
    return await this.citaRepository.save(actualizada);
  }

  async cancelar(uid: string): Promise<{ mensaje: string }> {
    const cita = await this.findOne(uid);
    try {
      cita.estado = 'Cancelada';
      await this.citaRepository.save(cita);
      return { mensaje: 'Cita cancelada correctamente' };
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      throw new BadRequestException('No se pudo cancelar la cita');
    }
  }
async cancelarCitasNoAtendidas() {
  const ahora = new Date();

  const resultado = await this.citaRepository
    .createQueryBuilder()
    .update()
    .set({ estado: 'Cancelada' })
    .where("fecha_hora < :ahora", { ahora })
    .andWhere("estado = :estado", { estado: 'Programada' })
    .execute();

  if (resultado.affected && resultado.affected > 0) {
    console.log(`Citas canceladas automáticamente: ${resultado.affected}`);
  }
}

}
