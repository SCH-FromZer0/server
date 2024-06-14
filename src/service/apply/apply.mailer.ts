import ApplyEntity from "../../domain/apply/apply.entity";
import fs from "node:fs";
import path from "node:path";
import handlebars from "handlebars";
import {sendMail} from "../../infra/module/mailer";
import env from "../../infra/module/dotenv";

async function sendApplication(application: ApplyEntity) {
    const _template = fs.readFileSync(path.join(__dirname, `../../templates/mail/application/application.hbs`), 'utf8');
    const template = handlebars.compile(_template);
    return await sendMail(
        application.email,
        `${application.name} 지원자님, FromZer0 지원서 보내드려요!`,
        template({
            name: application.name,
            studentId: application.studentId,
            requestedIp: application.requestedIp,
            link: `${env.CLIENT_URL}/apply/${application.id}`,
        })
    )
}

async function sendApplicationSubmitted(application: ApplyEntity, ip: string) {
    const _template = fs.readFileSync(path.join(__dirname, `../../templates/mail/application/submitted.hbs`), 'utf8');
    const template = handlebars.compile(_template);
    return await sendMail(
        application.email,
        `${application.name} 지원자님, FromZer0 지원이 완료되었어요!`,
        template({
            name: application.name,
            applicationId: application.id,
            submittedIp: ip,
            link: `${env.CLIENT_URL}/apply/${application.id}`,
        })
    )
}

async function sendResult(application: ApplyEntity, result: boolean) {
    const _template = fs.readFileSync(
        path.join(__dirname, `../../templates/mail/application/result/${result ? 'passed' : 'non_passed'}.hbs`),
        'utf8'
    );
    const template = handlebars.compile(_template);
    return await sendMail(
        application.email,
        `${application.name}님, ${result ? 'FromZer0에 오신것을 환영해요!' : '다음엔 꼭 동료로 만나요!'}`,
        template({
            name: application.name,
        })
    )
}

export {
    sendApplication,
    sendApplicationSubmitted,
    sendResult
}
