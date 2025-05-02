import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';

@Module({
  controllers: [ScheduleController],
  imports:[
    TypeOrmModule.forFeature([Schedule])
  ],
  exports:[
    TypeOrmModule, ScheduleService
  ],
  providers: [ScheduleService]
})
export class ScheduleModule {}
