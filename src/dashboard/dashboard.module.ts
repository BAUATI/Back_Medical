import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SedesModule } from 'src/sedes/sedes.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { HistoriasClinicasModule } from 'src/historias-clinicas/historias-clinicas.module';
import { CitasModule } from 'src/citas/citas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Usuario } from 'src/auth/entities/user.entity';
import { HistoriaClinica } from 'src/historias-clinicas/entities/historia-clinica.entity';
import { Cita } from 'src/citas/entities/cita.entity';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports:[
    TypeOrmModule.forFeature([Dashboard, Sede, Usuario, HistoriaClinica, Cita]),
    SedesModule,
    UsuariosModule,
    HistoriasClinicasModule,
    CitasModule
  ],
  exports: [
    DashboardService, TypeOrmModule
  ]
})
export class DashboardModule {}
