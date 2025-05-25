import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "src/auth/dto/update-user.dto";
import { Usuario } from "src/auth/entities/user.entity";
import { handleCustomError } from "src/functions/error";
import { Sede } from "src/sedes/entities/sede.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Sede)
    private readonly sedeRepository: Repository<Sede>
  ) {}

async findAll(filtros?: { sedeId?: string; rol?: string }) {
  try {
    const query = this.usuarioRepository.createQueryBuilder('usuario');

    if (filtros?.sedeId) {
      query.andWhere('usuario.sede = :sedeId', { sedeId: filtros.sedeId });
    }

    if (filtros?.rol) {
      query.andWhere('usuario.rol = :rol', { rol: filtros.rol });
    }

    return await query.getMany();
  } catch (error) {
    console.log(error);
    throw new BadRequestException('No es posible traer los usuarios');
  }
}

  async findOne(uid: string): Promise<Usuario> {
    try {
      const usuario = await this.usuarioRepository.findOneBy({ uid });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${uid} no encontrado`);
      }

      if (!usuario.estado) {
        throw new BadRequestException("El usuario esta desactivado");
      }

      return usuario;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`No se encontro el ID: ${uid}`);
    }
  }

async update(uid: string, updateUsuarioDto: UpdateUserDto) {
  try {
    // Buscar el usuario
    const usuario = await this.usuarioRepository.findOne({
      where: { uid },
      relations: ['sede'],
    });

    if (!usuario) {
      throw new NotFoundException(`No existe el usuario con ID: ${uid}`);
    }

    // Manejo de sede
    if (updateUsuarioDto.sedeId && updateUsuarioDto.sedeId !== usuario.sede?.uid) {
      const sede = await this.sedeRepository.findOneBy({ uid: updateUsuarioDto.sedeId });
      if (!sede) {
        throw new BadRequestException('La sede indicada no existe');
      }
      usuario.sede = sede;
    }

    // Manejo de contraseña
    if (updateUsuarioDto.password) {
      if (updateUsuarioDto.password.length < 6) {
        throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
      }
      const salt = bcrypt.genSaltSync();
      usuario.password = bcrypt.hashSync(updateUsuarioDto.password, salt);
    }

    // Eliminar campos que no se deben asignar directamente
    const {
      sedeId,
      password, // ya fue manejado
      ...restoCampos
    } = updateUsuarioDto;

    // Asignar el resto de los campos
    Object.assign(usuario, restoCampos);

    // Guardar usuario actualizado
    return await this.usuarioRepository.save(usuario);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw handleCustomError(error);
  }
}


  async desactivar(uid: string) {
    try {
      const usuario = await this.usuarioRepository.findOneBy({ uid });

      if (!usuario) {
        throw new BadRequestException("El usuario no existe");
      }

      await this.usuarioRepository.update(uid, { estado: !usuario.estado });

      const estadoActualizado = usuario.estado ? "desactivado" : "activado";
      return { mensaje: `Usuario ${estadoActualizado} correctamente` };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `No se pudo cambiar el estado del usuario con el ID: ${uid}`
      );
    }
  }
}
