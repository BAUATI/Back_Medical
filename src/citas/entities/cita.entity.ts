import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sede } from '../../sedes/entities/sede.entity';
import { Usuario } from 'src/auth/entities/user.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'paciente_uid' })
  paciente: Usuario;
  
  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'profesional_uid' })
  profesional: Usuario;

  @ManyToOne(() => Sede, { eager: true })
  @JoinColumn({ name: 'sede_uid' })
  sede: Sede;

  @Column('timestamp')
  fecha_hora: Date;

  @Column('varchar', { nullable: true })
  motivo: string;

  @Column('varchar', { nullable: true, default: 'Programada' })
  estado: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn({ nullable: true })
  fecha_modificacion: Date;
}
