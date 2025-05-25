import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SedesService } from './sedes.service';
import { SedesController } from './sedes.controller';
import { Sede } from './entities/sede.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sede]), AuthModule],
  controllers: [SedesController],
  providers: [SedesService, UsuariosService],
  exports: [SedesService, TypeOrmModule],
})
export class SedesModule {}
