import { Module } from '@nestjs/common';
import { ConsultorioService } from './consultorio.service';
import { ConsultorioController } from './consultorio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultorio } from './entities/consultorio.entity';

@Module({
  controllers: [ConsultorioController],
  imports:[
    TypeOrmModule.forFeature([Consultorio]),
    
  ],
  exports:[
    TypeOrmModule, ConsultorioService
  ],
  providers: [ConsultorioService]
})
export class ConsultorioModule {}
