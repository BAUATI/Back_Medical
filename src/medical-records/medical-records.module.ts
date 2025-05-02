import { Module } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  controllers: [MedicalRecordsController],
  imports:[
    TypeOrmModule.forFeature([MedicalRecord, User, Appointment]),
    AuthModule,
    AppointmentModule,
  ],
  exports:[
    TypeOrmModule, MedicalRecordsService
  ],
  providers: [MedicalRecordsService]
})
export class MedicalRecordsModule {}
