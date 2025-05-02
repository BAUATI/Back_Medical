import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { ValidRols } from 'src/auth/interfaces/valid-rols';
import { QueryAppointmentDto } from './dto/query-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Consultorio)
    private readonly consultorioRepository: Repository<Consultorio>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  private parseRols(rols: string | string[]): string[] {
    try {
      return typeof rols === 'string' ? JSON.parse(rols) : rols;
    } catch (error) {
      throw new BadRequestException('Error al parsear los roles del usuario');
    }
  }


  async create(createAppointmentDto: CreateAppointmentDto, user: User) {
    // Parsear roles
    const userRoles = this.parseRols(user.rols);

    // Verificar roles
    if (!userRoles.includes(ValidRols.administrativo) && !userRoles.includes(ValidRols.paciente)) {
      throw new ForbiddenException('Solo administrativos o pacientes pueden crear citas');
    }

    // Validar paciente
    const patient = await this.userRepository.findOne({ where: { id: createAppointmentDto.patientId } });
    if (!patient || !this.parseRols(patient.rols).includes(ValidRols.paciente)) {
      throw new NotFoundException('Paciente no encontrado o no tiene rol PACIENTE');
    }

    // Validar profesional
    const professional = await this.userRepository.findOne({ where: { id: createAppointmentDto.professionalId } });
    if (!professional || !this.parseRols(professional.rols).includes(ValidRols.profesional)) {
      throw new NotFoundException('Profesional no encontrado o no tiene rol PROFESIONAL');
    }

    // Validar consultorio
    const consultorio = await this.consultorioRepository.findOne({ where: { id: createAppointmentDto.consultorioId } });
    if (!consultorio) {
      throw new NotFoundException('Consultorio no encontrado');
    }

    // Validar horario
    if (createAppointmentDto.scheduleId) {
      const schedule = await this.scheduleRepository.findOne({ where: { id: createAppointmentDto.scheduleId } });
      if (!schedule) {
        throw new NotFoundException('Horario no encontrado');
      }
      // Validar que la cita esté dentro del horario
      const appointmentStart = new Date(`${createAppointmentDto.date}T${createAppointmentDto.startTime}`);
      const appointmentEnd = new Date(`${createAppointmentDto.date}T${createAppointmentDto.endTime}`);
      const scheduleStart = new Date(`${createAppointmentDto.date}T${schedule.startTime}`);
      const scheduleEnd = new Date(`${createAppointmentDto.date}T${schedule.endTime}`);
      if (appointmentStart < scheduleStart || appointmentEnd > scheduleEnd) {
        throw new BadRequestException('La cita no está dentro del horario disponible');
      }
    }

    // Validar que no haya superposición
    const overlappingAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.consultorioId = :consultorioId', { consultorioId: createAppointmentDto.consultorioId })
      .orWhere('appointment.professionalId = :professionalId', { professionalId: createAppointmentDto.professionalId })
      .andWhere('appointment.date = :date', { date: createAppointmentDto.date })
      .andWhere('appointment.isActive = :isActive', { isActive: true })
      .andWhere(
        '(:startTime BETWEEN appointment.startTime AND appointment.endTime OR :endTime BETWEEN appointment.startTime AND appointment.endTime OR appointment.startTime BETWEEN :startTime AND :endTime)',
        { startTime: createAppointmentDto.startTime, endTime: createAppointmentDto.endTime },
      )
      .getMany();

    if (overlappingAppointments.length > 0) {
      throw new BadRequestException('El consultorio o profesional ya tiene una cita en ese horario');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      patient,
      professional,
      consultorio,
    });

    return await this.appointmentRepository.save(appointment);
  }

  async findAll(query: QueryAppointmentDto, user: User) {
    const userRoles = this.parseRols(user.rols);

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.professional', 'professional')
      .leftJoinAndSelect('appointment.consultorio', 'consultorio')
      .where('appointment.isActive = :isActive', { isActive: true });

    if (query.patientId) {
      queryBuilder.andWhere('appointment.patientId = :patientId', { patientId: query.patientId });
    }

    if (query.professionalId) {
      queryBuilder.andWhere('appointment.professionalId = :professionalId', { professionalId: query.professionalId });
    }

    if (query.consultorioId) {
      queryBuilder.andWhere('appointment.consultorioId = :consultorioId', { consultorioId: query.consultorioId });
    }

    // Restringir acceso para pacientes y profesionales
    if (!userRoles.includes(ValidRols.administrativo)) {
      if (userRoles.includes(ValidRols.paciente)) {
        queryBuilder.andWhere('appointment.patientId = :userId', { userId: user.id });
      } else if (userRoles.includes(ValidRols.profesional)) {
        queryBuilder.andWhere('appointment.professionalId = :userId', { userId: user.id });
      }
    }

    const [data, count] = await queryBuilder
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();

    return { data, count };
  }

  async findOne(id: string, user: User) {
    const userRoles = this.parseRols(user.rols);

    const appointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.professional', 'professional')
      .leftJoinAndSelect('appointment.consultorio', 'consultorio')
      .where('appointment.id = :id', { id })
      .andWhere('appointment.isActive = :isActive', { isActive: true })
      .getOne();

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Restringir acceso
    if (!userRoles.includes(ValidRols.administrativo)) {
      if (
        (userRoles.includes(ValidRols.paciente) && appointment.patientId !== user.id) ||
        (userRoles.includes(ValidRols.profesional) && appointment.professionalId !== user.id)
      ) {
        throw new ForbiddenException('No tienes permiso para ver esta cita');
      }
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto, user: User) {
    const userRoles = this.parseRols(user.rols);

    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Verificar roles
    if (!userRoles.includes(ValidRols.administrativo)) {
      if (
        (userRoles.includes(ValidRols.paciente) && appointment.patientId !== user.id) ||
        (userRoles.includes(ValidRols.profesional) && appointment.professionalId !== user.id)
      ) {
        throw new ForbiddenException('No tienes permiso para actualizar esta cita');
      }
    }

    // Validar superposición si se actualiza horario
    if (updateAppointmentDto.date || updateAppointmentDto.startTime || updateAppointmentDto.endTime) {
      const overlappingAppointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.id != :id', { id })
        .andWhere('appointment.consultorioId = :consultorioId', { consultorioId: appointment.consultorioId })
        .orWhere('appointment.professionalId = :professionalId', { professionalId: appointment.professionalId })
        .andWhere('appointment.date = :date', { date: updateAppointmentDto.date || appointment.date })
        .andWhere('appointment.isActive = :isActive', { isActive: true })
        .andWhere(
          '(:startTime BETWEEN appointment.startTime AND appointment.endTime OR :endTime BETWEEN appointment.startTime AND appointment.endTime OR appointment.startTime BETWEEN :startTime AND :endTime)',
          {
            startTime: updateAppointmentDto.startTime || appointment.startTime,
            endTime: updateAppointmentDto.endTime || appointment.endTime,
          },
        )
        .getMany();

      if (overlappingAppointments.length > 0) {
        throw new BadRequestException('El consultorio o profesional ya tiene una cita en ese horario');
      }
    }

    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: string, user: User) {
    const userRoles = this.parseRols(user.rols);

    const appointment = await this.appointmentRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    // Verificar roles
    if (!userRoles.includes(ValidRols.administrativo)) {
      if (
        (userRoles.includes(ValidRols.paciente) && appointment.patientId !== user.id) ||
        (userRoles.includes(ValidRols.profesional) && appointment.professionalId !== user.id)
      ) {
        throw new ForbiddenException('No tienes permiso para eliminar esta cita');
      }
    }

    appointment.isActive = false;
    await this.appointmentRepository.save(appointment);
    return { message: 'Cita eliminada' };
  }

}
