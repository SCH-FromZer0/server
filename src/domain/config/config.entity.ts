import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index, DeleteDateColumn,
} from 'typeorm';
import {ConfigId, ConfigValue} from "../../interfaces/config/key";

@Entity({
    name: 'config',
    orderBy: {
        createdAt: 'DESC',
    },
    synchronize: true,
})
export default class ConfigEntity {
    @Index()
    @PrimaryGeneratedColumn()
    public readonly id: string;

    @Column('varchar', {
        nullable: false,
        unique: true,
    })
    public readonly name: ConfigId;

    @Column('jsonb', {
        nullable: false,
        default: {}
    })
    public data: ConfigValue;

    @Column('uuid', {
        nullable: true,
        name: 'last_edited_by'
    })
    public lastEditedBy: string

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

    constructor(
        name: ConfigId,
        config: ConfigValue
    ) {
        this.name = name;
        this.data = config;
    }
}
