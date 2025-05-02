import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-header.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RolProtected } from './decorators/rol-protected.decorator';
import { ValidRols } from './interfaces/valid-rols';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
   @GetUser() user: User,
   @RawHeaders() rawHeaders: string[]
  ){  
    return {
      user,
      rawHeaders
    }
  }
  @Get('private2')
  @RolProtected(ValidRols.administrativo)
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute2(
   @GetUser() user: User,  
  ){  
    return {
      user,
      
    }
  }

  @Get('private3')
  @Auth()
  testingPrivateRoute3(
   @GetUser() user: User,  
  ){  
    return {
      user,
      
    }
  }

  @Get('revalidate')
  @UseGuards(AuthGuard())
  validateToken(
    @Req() req: Express.Request,
    @GetUser() user: User,   
  ) {
    return {
      ok: true,
      msg: 'Validando el token',
      user      
    }
  }

}
