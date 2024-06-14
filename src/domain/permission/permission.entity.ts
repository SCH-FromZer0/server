import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index, DeleteDateColumn,
} from 'typeorm';

@Entity({
    name: 'permission',
    orderBy: {
        createdAt: 'DESC',
    },
    synchronize: true,
})
export default class PermissionEntity {
    @Index()
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column('int', {
        nullable: false,
        default: 0
    })
    public administration: number;

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
        id: string,
        administration?: number
    ) {
        this.id = id;
        this.administration = administration ?? 0;
    }
}
