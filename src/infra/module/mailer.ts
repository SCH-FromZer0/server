import env from './dotenv';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
const _mailgun = new Mailgun(FormData);
const mailgun = _mailgun.client({username: 'api', key: env.MAILGUN_API_KEY});

async function sendMail(targetAddress: string, subject: string, message: string): Promise<boolean> {
    try{
        await mailgun.messages.create('mail.fromzero.tech', {
            from: `FromZer0 <no-reply@mail.fromzero.tech>`,
            to: targetAddress,
            subject: subject,
            html: message
        });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export {
    sendMail
}
