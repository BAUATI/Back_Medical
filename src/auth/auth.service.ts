import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "./entities/user.entity";
import { Repository } from "typeorm";
import { handleCustomError } from "src/functions/error";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtPayload } from "./interfaces/jwt-payload";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly authRepository: Repository<Usuario>,
    private readonly jwtService: JwtService
  ) {}

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

async create(createUserDto: CreateUserDto): Promise<Usuario> {
  try {
    const { correo, cedula, password, ...resto } = createUserDto;

    // Validar existencia por correo o cédula
    const existe = await this.authRepository.findOne({
      where: [{ correo }, { cedula }],
    });

    if (existe) {
      throw new BadRequestException('Ya existe un usuario con ese correo o cédula');
    }

    // Encriptar contraseña si existe
    let hashedPassword: string | undefined;
    if (password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Crear usuario
    const user = this.authRepository.create({
      ...resto,
      correo,
      cedula,
      password: hashedPassword,
    });

    const nuevoUsuario = await this.authRepository.save(user);

    // Evitar retornar el password
    delete (nuevoUsuario as any).password;

    return nuevoUsuario;

  } catch (error) {
    console.error(error);
    throw handleCustomError(error);
  }
}

async login(loginUserDto: LoginUserDto) {
  try {
    const { correo, password } = loginUserDto;

  // Buscar usuario incluyendo el password encriptado
  const user = await this.authRepository.findOne({
    where: { correo },
    select: {
      uid: true,
      correo: true,
      password: true,
      rol: true,
      nombre: true,
      estado: true,
    },
  });

  if (!user) {
    throw new BadRequestException("Necesitas permisos del administrador del aplicativo para ingresar aquí");
  }

  if (!user.estado) {
    throw new BadRequestException("Usuario desactivado, comunícate con el administrador");
  }

  // Validar que el password coincida
  const passwordValido = await bcrypt.compare(password, user.password);
  if (!passwordValido) {
    throw new BadRequestException("Credenciales incorrectas");
  }

  // Retornar token y datos públicos
  return {
    token: this.getJwtToken({ uid: user.uid }),
    user: {
      id: user.uid,
      correo: user.correo,
      nombre: user.nombre,
      rol: user.rol,
    },
  };
  } catch (error) {
     console.error(error);

  // Si ya es una excepción de Nest, simplemente relánzala
  if (error instanceof BadRequestException) {
    throw error;
  }

  // Si es otra cosa inesperada
  throw new BadRequestException("Error en el servicio, revisa los logs");
  }
}

  async checkAuthStatus(user: Usuario) {
    const { uid } = user;
    const token = this.getJwtToken({ uid });
    return {
      ok: true,
      uid,
      token,
      user,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
