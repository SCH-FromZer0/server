import database from '../../infra/connector/database';
import TelegramEntity from "./telegram.entity";
import md5 from 'md5';

const telegramRepository = database.source.getRepository(TelegramEntity).extend({
    async isRegistered(chatId: number): Promise<boolean>{
        return (await this.count({
            where: {
                chatId: chatId
            }
        })) > 0;
    },

    async createNewChatObject(chatId: number): Promise<string> {
        const chatObject: TelegramEntity = await this.save(new TelegramEntity(chatId));
        return md5(`${chatObject.id}${chatId}`);
    },

    async unlink(chatId: number) {}
})

export default telegramRepository;
