import { Usuario } from "src/auth/entities/user.entity";
import { HistoriaClinica } from "src/historias-clinicas/entities/historia-clinica.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("prescripciones")
export class Prescripcione {
  @PrimaryGeneratedColumn("uuid")
  uid: string;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: "paciente_uid" })
  paciente: Usuario;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: "profesional_uid" })
  profesional: Usuario;

  @ManyToOne(() => HistoriaClinica, { eager: true })
  @JoinColumn({ name: "historia_clinica_uid" })
  historiaClinica: HistoriaClinica;

  @Column("text")
  medicamentos: string;

  @Column("text", { nullable: true, default: "No aplica" })
  recomendaciones: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn({ nullable: true })
  fecha_modificacion: Date;
}
