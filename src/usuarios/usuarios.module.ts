import { Module } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { UsuariosController } from "./usuarios.controller";
import { AuthModule } from "src/auth/auth.module";
import { SedesModule } from "src/sedes/sedes.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "src/auth/entities/user.entity";
import { Sede } from "src/sedes/entities/sede.entity";

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    TypeOrmModule.forFeature([Usuario, Sede]), // ✅ registra los repositorios necesarios
    AuthModule,
    SedesModule,
  ],
  exports: [UsuariosService, TypeOrmModule], // ✅ exporta el servicio y el módulo de TypeOrm para que otros módulos puedan usarlo
})
export class UsuariosModule {}
