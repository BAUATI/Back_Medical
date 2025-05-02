import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';

import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { QueryMedicalRecordDto } from './dto/query-medical-record.dto';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { ValidRols } from 'src/middlewares/menu-ros';


@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  private parseRols(rols: string | string[]): string[] {
    try {
      return typeof rols === 'string' ? JSON.parse(rols) : rols;
    } catch (error) {
      throw new BadRequestException('Error al parsear los roles del usuario');
    }
  }

  async create(createMedicalRecordDto: CreateMedicalRecordDto, user: User) {
    const userRoles = this.parseRols(user.rols);

    // Solo profesionales y administrativos pueden crear registros
    if (!userRoles.includes(ValidRols.profesional) && !userRoles.includes(ValidRols.administrativo)) {
      throw new ForbiddenException('Solo profesionales o administrativos pueden crear registros clínicos');
    }

    // Validar paciente
    const patient = await this.userRepository.findOne({ where: { id: createMedicalRecordDto.patientId } });
    if (!patient || !this.parseRols(patient.rols).includes(ValidRols.paciente)) {
      throw new NotFoundException('Paciente no encontrado o no tiene rol PACIENTE');
    }

    // Validar profesional
    const professional = await this.userRepository.findOne({ where: { id: createMedicalRecordDto.professionalId } });
    if (!professional || !this.parseRols(professional.rols).includes(ValidRols.profesional)) {
      throw new NotFoundException('Profesional no encontrado o no tiene rol PROFESIONAL');
    }

    // Validar cita
    const appointment = await this.appointmentRepository.findOne({ where: { id: createMedicalRecordDto.appointmentId } });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }
    if (appointment.status !== 'CONFIRMADA') {
      throw new BadRequestException('La cita debe estar CONFIRMADA para crear un registro clínico');
    }
    if (appointment.patientId !== createMedicalRecordDto.patientId || appointment.professionalId !== createMedicalRecordDto.professionalId) {
      throw new BadRequestException('La cita no corresponde al paciente o profesional indicado');
    }

    const medicalRecord = this.medicalRecordRepository.create({
      ...createMedicalRecordDto,
      patient,
      professional,
      appointment,
    });

    return await this.medicalRecordRepository.save(medicalRecord);
  }

  async findAll(query: QueryMedicalRecordDto, user: User) {
    const userRoles = this.parseRols(user.rols);

    const queryBuilder = this.medicalRecordRepository
      .createQueryBuilder('medicalRecord')
      .leftJoinAndSelect('medicalRecord.patient', 'patient')
      .leftJoinAndSelect('medicalRecord.professional', 'professional')
      .leftJoinAndSelect('medicalRecord.appointment', 'appointment')
      .where('medicalRecord.isActive = :isActive', { isActive: true });

    if (query.patientId) {
      queryBuilder.andWhere('medicalRecord.patientId = :patientId', { patientId: query.patientId });
    }

    if (query.professionalId) {
      queryBuilder.andWhere('medicalRecord.professionalId = :professionalId', { professionalId: query.professionalId });
    }

    if (query.appointmentId) {
      queryBuilder.andWhere('medicalRecord.appointmentId = :appointmentId', { appointmentId: query.appointmentId });
    }

    // Restringir acceso
    if (!userRoles.includes(ValidRols.administrativo)) {
      if (userRoles.includes(ValidRols.paciente)) {
        queryBuilder.andWhere('medicalRecord.patientId = :userId', { userId: user.id });
      } else if (userRoles.includes(ValidRols.profesional)) {
        queryBuilder.andWhere('medicalRecord.professionalId = :userId', { userId: user.id });
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

    const medicalRecord = await this.medicalRecordRepository
      .createQueryBuilder('medicalRecord')
      .leftJoinAndSelect('medicalRecord.patient', 'patient')
      .leftJoinAndSelect('medicalRecord.professional', 'professional')
      .leftJoinAndSelect('medicalRecord.appointment', 'appointment')
      .where('medicalRecord.id = :id', { id })
      .andWhere('medicalRecord.isActive = :isActive', { isActive: true })
      .getOne();

    if (!medicalRecord) {
      throw new NotFoundException('Registro clínico no encontrado');
    }

    // Restringir acceso
    if (!userRoles.includes(ValidRols.administrativo)) {
      if (
        (userRoles.includes(ValidRols.paciente) && medicalRecord.patientId !== user.id) ||
        (userRoles.includes(ValidRols.profesional) && medicalRecord.professionalId !== user.id)
      ) {
        throw new ForbiddenException('No tienes permiso para ver este registro clínico');
      }
    }

    return medicalRecord;
  }

  async update(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto, user: User) {
    const userRoles = this.parseRols(user.rols);

    const medicalRecord = await this.medicalRecordRepository.findOne({ where: { id } });
    if (!medicalRecord) {
      throw new NotFoundException('Registro clínico no encontrado');
    }

    // Solo profesionales y administrativos pueden actualizar
    if (!userRoles.includes(ValidRols.administrativo)) {
      if (userRoles.includes(ValidRols.profesional) && medicalRecord.professionalId !== user.id) {
        throw new ForbiddenException('No tienes permiso para actualizar este registro clínico');
      }
      if (userRoles.includes(ValidRols.paciente)) {
        throw new ForbiddenException('Los pacientes no pueden actualizar registros clínicos');
      }
    }

    Object.assign(medicalRecord, updateMedicalRecordDto);
    return await this.medicalRecordRepository.save(medicalRecord);
  }

  async remove(id: string, user: User) {
    const userRoles = this.parseRols(user.rols);

    const medicalRecord = await this.medicalRecordRepository.findOne({ where: { id } });
    if (!medicalRecord) {
      throw new NotFoundException('Registro clínico no encontrado');
    }

    // Solo administrativos pueden eliminar
    if (!userRoles.includes(ValidRols.administrativo)) {
      throw new ForbiddenException('Solo administrativos pueden eliminar registros clínicos');
    }

    medicalRecord.isActive = false;
    await this.medicalRecordRepository.save(medicalRecord);
    return { message: 'Registro clínico eliminado' };
  }
}