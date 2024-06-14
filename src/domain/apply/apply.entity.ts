import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index, DeleteDateColumn,
} from 'typeorm';
import {InterestsForm} from "../../interfaces/apply/form";

@Entity({
    name: 'apply',
    orderBy: {
        createdAt: 'DESC',
    },
    synchronize: true,
})
export default class ApplyEntity {
    @Index()
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column('int', {
        nullable: false,
        name: 'student_id'
    })
    public studentId: number;

    @Column('varchar', {
        length: 100,
        nullable: false,
    })
    public name: string;

    @Column('varchar', {
        length: 100,
        nullable: false,
    })
    public email: string;

    @Column('varchar', {
        length: 20,
        nullable: false,
        name: 'phone',
    })
    public phone: string;

    @Column('varchar', {
        length: 150,
        nullable: false,
        unique: true,
        name: 'requested_ip',
    })
    public requestedIp: string;

    @Column('varchar', {
        length: 150,
        nullable: true,
        unique: true,
        name: 'permitted_ip',
    })
    public permittedIp: string;

    @Column('jsonb', {
        nullable: false,
        default: {}
    })
    public interests: InterestsForm;

    @Column({
        type: 'text',
        nullable: true,
        unique: false,
    })
    public projects: string;

    @Column({
        type: 'text',
        nullable: true,
        unique: false,
    })
    public resolution: string;

    @Column('boolean', {
        nullable: false,
        name: 'is_submitted',
        default: false,
    })
    public isSubmitted: boolean;

    @Column('boolean', {
        nullable: true,
        default: null,
    })
    public result: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        nullable: false,
        update: false,
        comment: 'created timestamp',
    })
    public readonly createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        nullable: false,
        update: false,
        comment: 'updated timestamp',
    })
    public readonly updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'processed_at',
        nullable: true,
        update: false,
        comment: 'deleted timestamp',
    })
    public readonly processedAt: Date;

    constructor(
        studentId: number,
        name: string,
        email: string,
        phone: string,
        requestedIp: string,
        interests: object,
        projects: string | null,
        resolution: string | null,
    ) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.requestedIp = requestedIp;
        this.interests = interests;
        this.projects = projects;
        this.resolution = resolution;
    }
}
