import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index, DeleteDateColumn,
} from 'typeorm';

@Entity({
    name: 'invitation',
    orderBy: {
        createdAt: 'DESC',
    },
    synchronize: true,
})
export default class InvitationEntity {
    @Index()
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column('int', {
        nullable: true,
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

    @Column('boolean', {
        nullable: false,
        name: 'is_internal',
        default: false,
    })
    public isInternal: boolean;

    @Column('uuid', {
        nullable: true,
        name: 'issuer_id',
    })
    public issuerId: string;

    @Column('varchar', {
        nullable: true,
        default: null
    })
    public association: string | null;

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
        name: 'used_at',
        nullable: true,
        update: false,
        comment: 'used timestamp',
    })
    public readonly usedAt: Date;

    constructor(
        name: string,
        email: string,
        phone: string,
        isInternal: boolean,
        issuerId?: string,
        studentId?: number,
        association?: string | null
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.isInternal = isInternal;
        this.studentId = studentId ?? null;
        this.issuerId = issuerId ?? null;
        this.association = association ?? null;
    }
}
