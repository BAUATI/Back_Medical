import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';


@Entity('medical_records')
export class MedicalRecord {
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

  @ManyToOne(() => Appointment, { nullable: false })
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @Column('uuid')
  appointmentId: string;

  @Column('text')
  diagnosis: string;

  @Column('text', { nullable: true })
  treatment: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}