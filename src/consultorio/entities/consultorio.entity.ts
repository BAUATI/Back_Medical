import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Sede } from 'src/sede/entities/sede.entity';


@Entity('consultorios')
export class Consultorio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('boolean', { default: true })
    isAvailable: boolean;

    @ManyToOne(() => Sede, (sede) => sede.consultorios, { nullable: false })
    sede: Sede;

    @ManyToOne(() => User, { nullable: true })
    professional: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}