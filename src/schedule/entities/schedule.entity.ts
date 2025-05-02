import { User } from 'src/auth/entities/user.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('schedules')
export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: false })
    professional: User;

    @ManyToOne(() => Consultorio, { nullable: false })
    consultorio: Consultorio;

    @Column('varchar', { length: 20 })
    dayOfWeek: string; // Ej. "Lunes", "Martes"

    @Column('time')
    startTime: string; // Ej. "08:00:00"

    @Column('time')
    endTime: string; // Ej. "12:00:00"

    @Column('boolean', { default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}