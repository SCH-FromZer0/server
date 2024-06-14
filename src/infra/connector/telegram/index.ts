import TelegramBot from "node-telegram-bot-api";
import dotenv from "../../module/dotenv";
import {telegramRepository} from "../../../domain";

const telegramBot = new TelegramBot(dotenv.TELEGRAM_API_KEY, {polling: true});

telegramBot.onText(/\/start/, async (msg: TelegramBot.Message, match: RegExpExecArray) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    if(await telegramRepository.isRegistered(chatId))
        return await telegramBot.sendMessage(chatId, '이미 설정중이거나 완료하셨네요!\n더 이상의 설정은 필요하지 않아요.');
    await telegramBot.sendMessage(msg.chat.id, "FromZer0 업데이트 봇에 어서오세요.\n어떻게 설정을 도와드릴까요?", {
        reply_markup: {
            inline_keyboard: [
                [{ text: '봇을 처음 써봐요', callback_data: 'startAction.new' }],
                [{ text: '텔레그램 계정을 바꿨어요', callback_data: 'startAction.change' }],
            ]
        }
    });
});

telegramBot.on('callback_query', async (callbackQuery) => {
    const action = callbackQuery.data.split('.');
    const msg = callbackQuery.message;
    const opts: TelegramBot.EditMessageTextOptions = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        parse_mode: 'Markdown'
    };

    switch(action[0]) {
        case 'startAction':
            if(await telegramRepository.isRegistered(msg.chat.id))
                return await telegramBot.editMessageText(`이미 등록되어 있네요.`, opts);
            switch(action[1]) {
                case 'new':
                    const registerHash = await telegramRepository.createNewChatObject(msg.chat.id);
                    await telegramBot.editMessageText(`알겠어요!\nFromZer0 홈페이지 → 내 계정 관리 → Telegram 봇 등록을 누르고 다음 코드를 입력해주세요!\n\n\`${registerHash}\``, opts);
                    break;
                default:
                    await telegramBot.editMessageText(`잘못된 요청인것 같아요.`, opts);
                    break;
            }
            break;
        default:
            await telegramBot.editMessageText(`잘못된 요청인것 같아요.`, opts);
            break;
    }
});

export default telegramBot;
