import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index, DeleteDateColumn,
} from 'typeorm';

export type TelegramSubscribe = 'account'

@Entity({
    name: 'telegram',
    orderBy: {
        createdAt: 'DESC',
    },
    synchronize: true,
})
export default class TelegramEntity {
    @Index()
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column('int', {
        nullable: false,
        unique: true,
        name: 'chat_id',
    })
    public chatId: number;

    @Column('uuid', {
        nullable: true,
        unique: true,
        name: 'user_id',
    })
    public userId: string;

    @Column('jsonb', {
        nullable: false,
        unique: false,
        default: []
    })
    public subscribed: string;

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
        name: 'unlinked_at',
        nullable: true,
        update: false,
        comment: 'unlinked timestamp',
    })
    public readonly unlinkedAt: Date;

    constructor(
        chatId: number
    ) {
        this.chatId = chatId;
    }
}
