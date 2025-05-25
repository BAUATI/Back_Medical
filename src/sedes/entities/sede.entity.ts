import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sedes')
export class Sede {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column('varchar')
  nombre: string;

  @Column('varchar')
  direccion: string;

  @Column('varchar', { nullable: true, default: "No aplica" })
  telefono: string;

  @Column('varchar', { nullable: true, default: "No aplica" })
  ciudad: string;

  @Column('varchar', { nullable: true, default: "No aplica" })
  departamento: string;

  @Column('boolean', { default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn({ nullable: true })
  fecha_modificacion: Date;
}
