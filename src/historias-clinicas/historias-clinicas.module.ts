import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { HistoriasClinicasController } from './historias-clinicas.controller';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { SedesModule } from 'src/sedes/sedes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoriaClinica]),
    AuthModule,
    UsuariosModule,
    SedesModule, 
  ],
  controllers: [HistoriasClinicasController],
  providers: [HistoriasClinicasService, UsuariosService],
  exports: [HistoriasClinicasService],
})
export class HistoriasClinicasModule {}
