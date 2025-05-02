import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';


@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column('uuid')
  patientId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'professionalId' })
  professional: User;

  @Column('uuid')
  professionalId: string;

  @ManyToOne(() => Consultorio, { nullable: false })
  @JoinColumn({ name: 'consultorioId' })
  consultorio: Consultorio;

  @Column('uuid')
  consultorioId: string;

  @ManyToOne(() => Schedule, { nullable: true })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @Column('uuid', { nullable: true })
  scheduleId: string;

  @Column('date')
  date: Date;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;

  @Column('varchar', { default: 'PROGRAMADA' })
  status: string; // PROGRAMADA, CONFIRMADA, CANCELADA, COMPLETADA

  @Column('text', { nullable: true })
  notes: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}