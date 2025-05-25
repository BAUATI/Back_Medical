import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './entities/horario.entity';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from 'src/auth/entities/user.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,

    @InjectRepository(Usuario)
    private readonly usuariosService: UsuariosService,
  ) {}

async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
  const profesional = await this.usuariosService.findOne(createHorarioDto.profesional_uid);

  if (!profesional || profesional.rol !== 'PROFESIONAL') {
    throw new BadRequestException('Profesional no válido o con rol incorrecto');
  }

  try {
    const horario = this.horarioRepository.create({
      ...createHorarioDto,
      profesional,
    });
    await this.horarioRepository.save(horario);
    return horario;
  } catch (error) {
    throw new BadRequestException('No se pudo crear el horario');
  }
}


  async findAll(): Promise<Horario[]> {
    return this.horarioRepository.find();
  }

  async findOne(uid: string): Promise<Horario> {
    const horario = await this.horarioRepository.findOneBy({ uid });
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }
    return horario;
  }

  async update(uid: string, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    const horario = await this.horarioRepository.findOneBy({ uid });
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }
    const actualizado = this.horarioRepository.merge(horario, updateHorarioDto);
    await this.horarioRepository.save(actualizado);
    return actualizado;
  }

  async remove(uid: string): Promise<void> {
    const horario = await this.horarioRepository.findOneBy({ uid });
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }
    await this.horarioRepository.remove(horario);
  }
}
