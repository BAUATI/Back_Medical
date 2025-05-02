import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayLoad } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService,
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: configService.get('SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayLoad): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'username', 'firstName', 'lastName', 'rols', 'isActive'],
          });
      
          if (!user) {
            throw new UnauthorizedException('Invalid token');
          }
      
          if (!user.isActive) {
            throw new UnauthorizedException('Inactive user');
          }

          
      
          return user;
    }

}