import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/auth/entities/user.entity';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'profesional_uid' })
  profesional: Usuario;

  @Column('varchar')
  fecha: string;

  @Column('time')
  hora_inicio: string;

  @Column('time')
  hora_fin: string;

  @Column('boolean', { default: true })
  disponible: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn({ nullable: true })
  fecha_modificacion: Date;
}
