import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { User } from 'src/auth/entities/user.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SedeModule } from 'src/sede/sede.module';

@Module({
  controllers: [AppointmentController],
  imports:[
    TypeOrmModule.forFeature([Appointment, Consultorio, User, Schedule]),
    AuthModule,
    SedeModule,
  ],
  exports:[
    TypeOrmModule, AppointmentService
  ],
  providers: [AppointmentService]
})
export class AppointmentModule {}
