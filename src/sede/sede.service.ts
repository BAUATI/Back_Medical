import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Repository } from 'typeorm';
import { Sede } from './entities/sede.entity';
import { ValidRols } from 'src/auth/interfaces/valid-rols';
import { UpdateScheduleDto } from 'src/schedule/dto/update-schedule.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';
import { UpdateConsultorioDto } from 'src/consultorio/dto/update-consultorio.dto';
import { CreateConsultorioDto } from 'src/consultorio/dto/create-consultorio.dto';

@Injectable()
export class SedeService {
  private readonly logger = new Logger('SedeService');

  constructor(
    @InjectRepository(Sede)
    private readonly sedeRepository: Repository<Sede>,
    @InjectRepository(Consultorio)
    private readonly consultorioRepository: Repository<Consultorio>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async createSede(createSedeDto: CreateSedeDto): Promise<Sede> {
    try {
      const sede = this.sedeRepository.create(createSedeDto);
      await this.sedeRepository.save(sede);
      return sede;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllSedes(paginationDto: PaginationDto): Promise<Sede[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      return await this.sedeRepository.find({
        take: limit,
        skip: offset,
        relations: ['consultorios'],
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneSede(id: string): Promise<Sede> {
    const sede = await this.sedeRepository.findOne({
      where: { id },
      relations: ['consultorios'],
    });
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${id} no encontrada`);
    }
    return sede;
  }

  async updateSede(id: string, updateSedeDto: UpdateSedeDto): Promise<Sede> {
    const sede = await this.sedeRepository.preload({
      id,
      ...updateSedeDto,
    });
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${id} no encontrada`);
    }
    try {
      await this.sedeRepository.save(sede);
      return sede;
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeSede(id: string): Promise<string> {
    const sede = await this.findOneSede(id);
    await this.sedeRepository.remove(sede);
    return `Sede con ID ${id} eliminada`;
  }

  // --- Consultorios ---

  async createConsultorio(createConsultorioDto: CreateConsultorioDto): Promise<Consultorio> {
    try {
      const { sedeId, professionalId, ...consultorioData } = createConsultorioDto;

      // Validar sede
      const sede = await this.sedeRepository.findOneBy({ id: sedeId });
      if (!sede) {
        throw new NotFoundException(`Sede con ID ${sedeId} no encontrada`);
      }

      // Validar profesional (si se proporciona)
      let professional: User | null = null;
      if (professionalId) {
        professional = await this.userRepository.findOneBy({ id: professionalId });
        if (!professional) {
          throw new NotFoundException(`Usuario con ID ${professionalId} no encontrado`);
        }
        const rols = JSON.parse(professional.rols);
        if (!rols.includes(ValidRols.profesional)) {
          throw new BadRequestException(`El usuario con ID ${professionalId} no tiene rol PROFESIONAL`);
        }
      }

      const consultorio = this.consultorioRepository.create({
        ...consultorioData,
        sede,
        professional,
      });
      await this.consultorioRepository.save(consultorio);
      return consultorio;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllConsultorios(paginationDto: PaginationDto, sedeId?: string): Promise<Consultorio[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const where = sedeId ? { sede: { id: sedeId } } : {};
      return await this.consultorioRepository.find({
        where,
        take: limit,
        skip: offset,
        relations: ['sede', 'professional'],
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneConsultorio(id: string): Promise<Consultorio> {
    const consultorio = await this.consultorioRepository.findOne({
      where: { id },
      relations: ['sede', 'professional'],
    });
    if (!consultorio) {
      throw new NotFoundException(`Consultorio con ID ${id} no encontrado`);
    }
    return consultorio;
  }

  async updateConsultorio(id: string, updateConsultorioDto: UpdateConsultorioDto): Promise<Consultorio> {
    const { sedeId, professionalId, ...consultorioData } = updateConsultorioDto;

    const consultorio = await this.consultorioRepository.preload({
      id,
      ...consultorioData,
    });
    if (!consultorio) {
      throw new NotFoundException(`Consultorio con ID ${id} no encontrado`);
    }

    // Actualizar sede si se proporciona
    if (sedeId) {
      const sede = await this.sedeRepository.findOneBy({ id: sedeId });
      if (!sede) {
        throw new NotFoundException(`Sede con ID ${sedeId} no encontrada`);
      }
      consultorio.sede = sede;
    }

    // Actualizar profesional si se proporciona
    if (professionalId) {
      const professional = await this.userRepository.findOneBy({ id: professionalId });
      if (!professional) {
        throw new NotFoundException(`Usuario con ID ${professionalId} no encontrado`);
      }
      const rols = JSON.parse(professional.rols);
      if (!rols.includes(ValidRols.profesional)) {
        throw new BadRequestException(`El usuario con ID ${professionalId} no tiene rol PROFESIONAL`);
      }
      consultorio.professional = professional;
    } else if (professionalId === null) {
      consultorio.professional = null;
    }

    try {
      await this.consultorioRepository.save(consultorio);
      return consultorio;
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeConsultorio(id: string): Promise<string> {
    const consultorio = await this.findOneConsultorio(id);
    await this.consultorioRepository.remove(consultorio);
    return `Consultorio con ID ${id} eliminado`;
  }

  // --- Horarios (Schedules) ---

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    try {
      const { professionalId, consultorioId, startTime, endTime, ...scheduleData } = createScheduleDto;

      // Validar profesional
      const professional = await this.userRepository.findOneBy({ id: professionalId });
      if (!professional) {
        throw new NotFoundException(`Usuario con ID ${professionalId} no encontrado`);
      }
      const rols = JSON.parse(professional.rols);
      if (!rols.includes(ValidRols.profesional)) {
        throw new BadRequestException(`El usuario con ID ${professionalId} no tiene rol PROFESIONAL`);
      }

      // Validar consultorio
      const consultorio = await this.consultorioRepository.findOneBy({ id: consultorioId });
      if (!consultorio) {
        throw new NotFoundException(`Consultorio con ID ${consultorioId} no encontrado`);
      }

      // Validar que endTime sea mayor que startTime
      if (startTime >= endTime) {
        throw new BadRequestException('endTime debe ser mayor que startTime');
      }

      // Validar que no haya superposición de horarios para el profesional o consultorio
      const overlappingSchedule = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .where('schedule.professionalId = :professionalId OR schedule.consultorioId = :consultorioId')
        .andWhere('schedule.dayOfWeek = :dayOfWeek')
        .andWhere('schedule.isActive = :isActive')
        .andWhere(
          '(:startTime BETWEEN schedule.startTime AND schedule.endTime OR :endTime BETWEEN schedule.startTime AND schedule.endTime OR schedule.startTime BETWEEN :startTime AND :endTime)'
        )
        .setParameters({
          professionalId,
          consultorioId,
          dayOfWeek: scheduleData.dayOfWeek,
          startTime,
          endTime,
          isActive: true,
        })
        .getOne();

      if (overlappingSchedule) {
        throw new BadRequestException('El horario se superpone con otro existente para el profesional o consultorio');
      }

      const schedule = this.scheduleRepository.create({
        ...scheduleData,
        startTime,
        endTime,
        professional,
        consultorio,
      });
      await this.scheduleRepository.save(schedule);
      return schedule;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllSchedules(paginationDto: PaginationDto, professionalId?: string, consultorioId?: string): Promise<Schedule[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const where: any = {};
      if (professionalId) where.professional = { id: professionalId };
      if (consultorioId) where.consultorio = { id: consultorioId };

      return await this.scheduleRepository.find({
        where,
        take: limit,
        skip: offset,
        relations: ['professional', 'consultorio'],
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneSchedule(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['professional', 'consultorio'],
    });
    if (!schedule) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }
    return schedule;
  }

  async updateSchedule(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const { professionalId, consultorioId, startTime, endTime, ...scheduleData } = updateScheduleDto;

    const schedule = await this.scheduleRepository.preload({
      id,
      ...scheduleData,
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
    });
    if (!schedule) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    // Actualizar profesional si se proporciona
    if (professionalId) {
      const professional = await this.userRepository.findOneBy({ id: professionalId });
      if (!professional) {
        throw new NotFoundException(`Usuario con ID ${professionalId} no encontrado`);
      }
      const rols = JSON.parse(professional.rols);
      if (!rols.includes(ValidRols.profesional)) {
        throw new BadRequestException(`El usuario con ID ${professionalId} no tiene rol PROFESIONAL`);
      }
      schedule.professional = professional;
    }

    // Actualizar consultorio si se proporciona
    if (consultorioId) {
      const consultorio = await this.consultorioRepository.findOneBy({ id: consultorioId });
      if (!consultorio) {
        throw new NotFoundException(`Consultorio con ID ${consultorioId} no encontrado`);
      }
      schedule.consultorio = consultorio;
    }

    // Validar que endTime sea mayor que startTime si ambos se actualizan
    if (startTime && endTime && startTime >= endTime) {
      throw new BadRequestException('endTime debe ser mayor que startTime');
    }

    // Validar superposición de horarios si se actualiza el horario
    if (startTime || endTime || scheduleData.dayOfWeek) {
      const checkStartTime = startTime || schedule.startTime;
      const checkEndTime = endTime || schedule.endTime;
      const checkDayOfWeek = scheduleData.dayOfWeek || schedule.dayOfWeek;

      const overlappingSchedule = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .where('schedule.id != :id')
        .andWhere('schedule.professionalId = :professionalId OR schedule.consultorioId = :consultorioId')
        .andWhere('schedule.dayOfWeek = :dayOfWeek')
        .andWhere('schedule.isActive = :isActive')
        .andWhere(
          '(:startTime BETWEEN schedule.startTime AND schedule.endTime OR :endTime BETWEEN schedule.startTime AND schedule.endTime OR schedule.startTime BETWEEN :startTime AND :endTime)'
        )
        .setParameters({
          id,
          professionalId: schedule.professional.id,
          consultorioId: schedule.consultorio.id,
          dayOfWeek: checkDayOfWeek,
          startTime: checkStartTime,
          endTime: checkEndTime,
          isActive: true,
        })
        .getOne();

      if (overlappingSchedule) {
        throw new BadRequestException('El horario se superpone con otro existente para el profesional o consultorio');
      }
    }

    try {
      await this.scheduleRepository.save(schedule);
      return schedule;
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeSchedule(id: string): Promise<string> {
    const schedule = await this.findOneSchedule(id);
    await this.scheduleRepository.remove(schedule);
    return `Horario con ID ${id} eliminado`;
  }

  private handleError(error: any): never {
    this.logger.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException(error.sqlMessage);
    }
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException('Verifica los logs del servidor');
  }

}
