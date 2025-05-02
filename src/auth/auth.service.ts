import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { MenuSiderbar } from 'src/middlewares/menu-ros';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  private getJwtToken(payload: JwtPayLoad) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
        const { password, birthDate, rols, ...userData } = createUserDto;

        const user = this.userRepository.create({
            ...userData,
            password: bcrypt.hashSync(password, 10),
            birthDate: birthDate ? new Date(birthDate) : null,
            rols: rols ? JSON.stringify(rols) : JSON.stringify(['PACIENTE'])
        });

        await this.userRepository.save(user);

        delete user.password;

        return user;
    } catch (error) {
        console.log(error);
        this.handleError(error);
    }
}


  async loginUser(loginUser: LoginUserDto) {

    const { email, password } = loginUser

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        username: true,
        password: true,
        id: true,
        rols: true,
        isActive: true,
        firstName: true
      }
    })

    if (!user)
      throw new UnauthorizedException('Verify credentials')

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Verify credentials')

    if (!user.isActive)
      throw new UnauthorizedException('Inactive user')

    const rols = JSON.parse(user.rols);
    const menu = MenuSiderbar(rols);

    return {
      token: this.getJwtToken({ id: user.id }),
      user: {
        username: user.username,
        id: user.id,
        rols: user.rols,
        isActive: user.isActive,
        firstName: user.firstName,
        menu        
      }
    }

  }

  async checkAuthStatus(user: User){
    const {id} = user
    const token = this.getJwtToken({id})
    return {
      ok: true,    
      id,
      token,
      user
    }
  }

  private handleError(error: any) {
    if (error.code === 'ER_DUP_ENTRY' )
      throw new BadRequestException(error.sqlMessage);
    console.log(error)

    throw new InternalServerErrorException('Verifica los logs del servidor')
  }

}
