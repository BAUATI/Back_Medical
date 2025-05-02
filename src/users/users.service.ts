import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(paginacion: PaginationDto): Promise<User[]> {
    const { limit = 10, offset = 0 } = paginacion;

    try {
      const users = await this.userRepository.find({
        take: limit,
        skip: offset,
      });
      return users;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Verifica los logs');
    }
  }

  async findOne(term: string): Promise<User> {
    let user: User;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder();
      user = await queryBuilder
        .where(`username = :username OR firstName = :firstName OR email = :email`, {
          username: term,
          firstName: term,
          email: term,
        })
        .getOne();
    }

    if (!user) {
      throw new NotFoundException(`No hay datos registrados para: ${term}`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Convertir rols a JSON si está presente
    const { rols, password, birthDate, ...rest } = updateUserDto;
    const userData = {
      id,
      ...rest,
      ...(rols && { rols: JSON.stringify(rols) }),
      ...(birthDate && { birthDate: new Date(birthDate) }),
    };

    const user = await this.userRepository.preload(userData);

    if (!user) {
      throw new NotFoundException(`No existe este ID: ${id}`);
    }

    if (password) {
      user.password = await this.hashPassword(password);
    }

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log(error);
      this.handleError(error);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return 'Borrado de la base de datos';
  }

  private handleError(error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException(error.sqlMessage);
    }
    console.log(error);

    throw new InternalServerErrorException('Verifica los logs del servidor');
  }
}