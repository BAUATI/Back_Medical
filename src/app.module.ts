import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SedesModule } from './sedes/sedes.module';
import { CitasModule } from './citas/citas.module';
import { HorariosModule } from './horarios/horarios.module';
import { HistoriasClinicasModule } from './historias-clinicas/historias-clinicas.module';
import { PrescripcionesModule } from './prescripciones/prescripciones.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DashboardModule } from './dashboard/dashboard.module';



@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({   
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      timezone: "Z",
      synchronize: true,
    }),

    CommonModule,   
    AuthModule,
    UsuariosModule,
    SedesModule,
    CitasModule,
    HorariosModule,
    HistoriasClinicasModule,
    PrescripcionesModule,
    DashboardModule,


  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
