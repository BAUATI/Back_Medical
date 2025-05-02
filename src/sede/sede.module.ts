import { Module } from '@nestjs/common';
import { SedeService } from './sede.service';
import { SedeController } from './sede.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sede } from './entities/sede.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [SedeController],
  imports:[
    TypeOrmModule.forFeature([Sede, Consultorio, Schedule, User]),
    AuthModule
  ],
  exports: [
    TypeOrmModule, SedeService
  ],
  providers: [SedeService]
})
export class SedeModule {}
