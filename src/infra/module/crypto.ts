import * as crypto from "node:crypto";

function mixStrings(str1: string, str2: string) {
    let result = '';
    let maxLength = Math.max(str1.length, str2.length);

    for (let i = 0; i < maxLength; i++) {
        if (i < str1.length) {
            result += str1[i];
        }
        if (i < str2.length) {
            result += str2[i];
        }
    }

    return result;
}

function flip(str: string) {
    return str.split('').reverse().join('')
}

function encryptPassword(createdAt: string, name: string, password: string) {
    const plain = flip(mixStrings(flip(mixStrings(flip(btoa(encodeURI(createdAt))), flip(btoa(encodeURI(name))))), flip(btoa(encodeURI(password)))));
    return crypto.createHash('sha256').update(crypto.createHash('sha256').update(plain).digest('base64')).digest('hex');
}

export {
    encryptPassword,
    mixStrings
}
