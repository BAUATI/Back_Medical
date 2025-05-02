import { Controller, Post, Body, Get, Patch, Delete, Param, Query } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { QueryMedicalRecordDto } from './dto/query-medical-record.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ValidRols } from 'src/middlewares/menu-ros';


@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  /**
   * Crea un registro clínico. Solo PROFESIONAL y ADMINISTRATIVO. Requiere token JWT.
   * @param createMedicalRecordDto Datos del registro (paciente, profesional, cita, diagnóstico).
   * @param user Usuario autenticado.
   * @returns Registro creado.
   */
  @Post()
  @Auth(ValidRols.profesional, ValidRols.administrativo)
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto, @GetUser() user: User) {
    return this.medicalRecordsService.create(createMedicalRecordDto, user);
  }

  /**
   * Lista registros clínicos. PACIENTE ve solo los suyos. PROFESIONAL los suyos. ADMINISTRATIVO todos.
   * Requiere token JWT.
   * @param query Filtros (patientId, professionalId, appointmentId, limit, offset).
   * @param user Usuario autenticado.
   * @returns Lista de registros con paginación.
   */
  @Get()
  @Auth(ValidRols.paciente, ValidRols.profesional, ValidRols.administrativo)
  findAll(@Query() query: QueryMedicalRecordDto, @GetUser() user: User) {
    return this.medicalRecordsService.findAll(query, user);
  }

  /**
   * Obtiene un registro clínico por ID. PACIENTE solo accede a los suyos. PROFESIONAL a los suyos. ADMINISTRATIVO a todos.
   * Requiere token JWT.
   * @param id ID del registro.
   * @param user Usuario autenticado.
   * @returns Detalles del registro.
   */
  @Get(':id')
  @Auth(ValidRols.paciente, ValidRols.profesional, ValidRols.administrativo)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.medicalRecordsService.findOne(id, user);
  }

  /**
   * Actualiza un registro clínico. PROFESIONAL actualiza los suyos. ADMINISTRATIVO todos. PACIENTE no puede.
   * Requiere token JWT.
   * @param id ID del registro.
   * @param updateMedicalRecordDto Datos a actualizar.
   * @param user Usuario autenticado.
   * @returns Registro actualizado.
   */
  @Patch(':id')
  @Auth(ValidRols.profesional, ValidRols.administrativo)
  update(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto, @GetUser() user: User) {
    return this.medicalRecordsService.update(id, updateMedicalRecordDto, user);
  }

  /**
   * Elimina un registro clínico (isActive = false). Solo ADMINISTRATIVO. Requiere token JWT.
   * @param id ID del registro.
   * @param user Usuario autenticado.
   * @returns Mensaje de confirmación.
   */
  @Delete(':id')
  @Auth(ValidRols.administrativo)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.medicalRecordsService.remove(id, user);
  }
}