import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sede } from './entities/sede.entity';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Injectable()
export class SedesService {
  constructor(
    @InjectRepository(Sede)
    private readonly sedeRepository: Repository<Sede>,
  ) {}

  async create(createSedeDto: CreateSedeDto): Promise<Sede> {
    try {
      const sede = this.sedeRepository.create(createSedeDto);
      return await this.sedeRepository.save(sede);
    } catch (error) {
      console.error('Error al crear sede:', error);
      throw new InternalServerErrorException('No se pudo crear la sede');
    }
  }

  async findAll(): Promise<Sede[]> {
    try {
      return await this.sedeRepository.find();
    } catch (error) {
      console.error('Error al obtener sedes:', error);
      throw new InternalServerErrorException('No se pudieron obtener las sedes');
    }
  }

  async findOne(uid: string): Promise<Sede> {
    const sede = await this.sedeRepository.findOneBy({ uid });
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${uid} no encontrada`);
    }
    return sede;
  }

  async update(uid: string, updateSedeDto: UpdateSedeDto): Promise<Sede> {
    const sede = await this.sedeRepository.findOneBy({ uid });
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${uid} no encontrada`);
    }

    // Actualizamos sólo campos válidos
    const actualizado = this.sedeRepository.merge(sede, updateSedeDto);

    try {
      return await this.sedeRepository.save(actualizado);
    } catch (error) {
      console.error('Error al actualizar sede:', error);
      throw new InternalServerErrorException('No se pudo actualizar la sede');
    }
  }

async desactivar(uid: string) {
  try {
    const sede = await this.sedeRepository.findOneBy({ uid });

    if (!sede) {
      throw new BadRequestException("La sede no existe");
    }

    const nuevoEstado = !sede.estado;
    await this.sedeRepository.update(uid, { estado: nuevoEstado });

    const estadoTexto = nuevoEstado ? "activada" : "desactivada";
    return { mensaje: `Sede ${estadoTexto} correctamente` };
  } catch (error) {
    console.error('Error al cambiar el estado de la sede:', error);
    throw new BadRequestException(
      `No se pudo cambiar el estado de la sede con el ID: ${uid}`,
    );
  }
}
}
