import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SedeModule } from './sede/sede.module';
import { ConsultorioModule } from './consultorio/consultorio.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,      
      autoLoadEntities: true,
      synchronize: true,
    }),

    CommonModule,

    UsersModule,

    AuthModule,

    SedeModule,

    ConsultorioModule,

    ScheduleModule,

    AppointmentModule,

    MedicalRecordsModule,


  ],
})
export class AppModule {}
