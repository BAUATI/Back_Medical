import { Module } from '@nestjs/common';
import { PrescripcionesService } from './prescripciones.service';
import { PrescripcionesController } from './prescripciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescripcione } from './entities/prescripcione.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HistoriasClinicasModule } from '../historias-clinicas/historias-clinicas.module';
import { HistoriaClinica } from 'src/historias-clinicas/entities/historia-clinica.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Sede } from 'src/sedes/entities/sede.entity';

@Module({
  controllers: [PrescripcionesController],
  providers: [PrescripcionesService, UsuariosService],
  imports: [
    TypeOrmModule.forFeature([Prescripcione, HistoriaClinica, Sede]),
    AuthModule,
    HistoriasClinicasModule
  ],
  exports: [],
})
export class PrescripcionesModule {}
