import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index, DeleteDateColumn,
} from 'typeorm';

@Entity({
    name: 'user',
    orderBy: {
        createdAt: 'DESC',
    },
    synchronize: true,
})
export default class UserEntity {
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

    @Column('varchar', {
        nullable: true,
        name: 'password',
    })
    public password: string;

    @Column('boolean', {
        nullable: false,
        name: 'is_active',
        default: true,
    })
    public isActive: boolean;

    @Column('varchar', {
        nullable: true,
    })
    public association: string;

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
        name: 'deleted_at',
        nullable: false,
        update: false,
        comment: 'deleted timestamp',
    })
    public readonly deletedAt: Date;

    constructor(
        studentId: number,
        name: string,
        email: string,
        phone: string,
        isInternal: boolean,
        password?: string,
        association?: string | null
    ) {
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.isInternal = isInternal;
        this.password = password ?? null;
        this.association = association ?? null;
    }
}
