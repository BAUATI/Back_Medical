import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, BeforeInsert, BeforeUpdate } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    firstName: string;

    @Column('varchar')
    lastName: string;

    @Column('varchar', { unique: true })
    email: string;

    @Column('varchar', { unique: true, nullable: true })
    username: string;

    @Column('varchar', { select: false })
    password: string;

    @Column('text', { default: '["PACIENTE"]' })
    rols: string;

    @Column('varchar', { unique: true, nullable: true })
    documentId: string;

    @Column('date', { nullable: true })
    birthDate: Date;

    @Column('varchar', { nullable: true })
    phone: string;

    @Column('varchar', { nullable: true })
    address: string;

    @Column('varchar', { nullable: true })
    healthCoverage: string;

    @Column('varchar', { nullable: true })
    specialty: string;

    @Column('varchar', { nullable: true })
    medicalLicense: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    registration_date: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    update_registration: Date;

    @BeforeInsert()
    @BeforeUpdate()
    parseRols() {
        if (typeof this.rols === 'object') {
            this.rols = JSON.stringify(this.rols);
        }
    }

    getParsedRols(): string[] {
        return JSON.parse(this.rols);
      }
}