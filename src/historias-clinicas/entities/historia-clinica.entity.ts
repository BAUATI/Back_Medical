import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/auth/entities/user.entity';

@Entity('historias_clinicas')
export class HistoriaClinica {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'paciente_uid' })
  paciente: Usuario;
  
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'profesional_uid' })
  profesional: Usuario;

  @Column('date')
  fecha: Date;

  @Column('text')
  motivo_consulta: string;

  @Column('varchar', { nullable: true, default: "Diagnosticado" })
  estado: string;

  @Column('text', { nullable: true, default: "No aplica" })
  antecedentes: string;

  @Column('text', { nullable: true, default: "No aplica" })
  diagnostico: string;

  @Column('text', { nullable: true, default: "No aplica" })
  tratamiento: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;
}
