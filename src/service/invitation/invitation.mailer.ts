import {InvitationEntity} from "../../domain";
import fs from "node:fs";
import path from "node:path";
import handlebars from "handlebars";
import {sendMail} from "../../infra/module/mailer";
import env from "../../infra/module/dotenv";
import moment from "moment";

async function sendInvitation(invitation: InvitationEntity) {
    const _template = fs.readFileSync(path.join(__dirname, `../../templates/mail/invitation/created.hbs`), 'utf8');
    const template = handlebars.compile(_template);
    return await sendMail(
        invitation.email,
        `${invitation.name}님의 FromZer0 초대장이 도착했어요!`,
        template({
            name: invitation.name,
            link: `${env.CLIENT_URL}/account/signup?code=${invitation.id}`,
            createdAt: moment(invitation.createdAt).format('YYYY/MM/DD HH:mm'),
            mode: invitation.issuerId ? '수동' : '자동'
        })
    )
}

export {
    sendInvitation
}
