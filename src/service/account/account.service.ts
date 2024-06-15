import {CustomRequest} from "../../infra/middleware/express";
import {NextFunction, Response} from "express";
import {HttpStatusCode} from "axios";
import {isUUID} from "class-validator";
import invitationRepository from "../../domain/invitation/invitation.repository";
import InvitationEntity from "../../domain/invitation/invitation.entity";
import userRepository from "../../domain/user/user.repository";
import TokenManager from "../../infra/module/token";
import UserEntity from "../../domain/user/user.entity";

async function signUp(req: CustomRequest, res: Response, next: NextFunction) {
    if(!req.body.invitationCode || !isUUID(req.body.invitationCode)) return res.status(HttpStatusCode.Unauthorized).send({
        message: "초대장 코드를 옳바르게 입력했는지 확인해주세요!"
    });
    const invitation: InvitationEntity = await invitationRepository.findById(req.body.invitationCode);
    if(!invitation) res.status(HttpStatusCode.NotFound).send({message: '초대장을 찾을 수 없어요. 받으신건 맞으시죠?'});

    if(await userRepository.findByNameAndStudentId(invitation.name, invitation.studentId)) return res.status(HttpStatusCode.Forbidden).send({
        message: '이미 계정을 생성하신것 같아요.'
    })

    const account = await userRepository.createAccount({
        name: invitation.name,
        studentId: invitation.studentId,
        email: invitation.email,
        phone: invitation.phone,
        isInternal: invitation.isInternal,
        password: req.body.password,
    });

    await invitationRepository.used(invitation.id);

    res.json({
        name: account.name,
        studentId: account.studentId,
        email: account.email,
        phone: account.phone,
        isInternal: account.isInternal,
    });
}

async function signIn(req: CustomRequest, res: Response, next: NextFunction) {
    const { email, password }: {
        email: string,
        password: string
    } = req.body;
    if(req.user) return next();

    if(typeof email !== 'string' || typeof password !== 'string' || email === '' || password === '')
        return res.status(HttpStatusCode.Forbidden).send({message: '잘못 전송된 것 같아요.'});

    const user = await userRepository.findAccount(String(email), String(password));

    if(!user) return res.status(HttpStatusCode.Forbidden).send({message: '계정이 존재하지 않거나 계정 정보가 잘못된 것 같아요.'});

    req.user = user;
    next();
}

async function signOut(req: CustomRequest, res: Response, next: NextFunction) {
    const { token } = req.query;
    await new TokenManager().getAndDelRefreshToken(String(token));

    return res.json({
        success: true
    })
}

async function getToken(req: CustomRequest, res: Response, next: NextFunction) {
    if(!req.user) return next();

    const tokenManager = new TokenManager(req.user.id);
    const token = await tokenManager.generateTokenObject();
    res.send(token);
}

async function getUserData(req: CustomRequest, res: Response, next: NextFunction) {
    res.send({
        name: req.user.name,
        studentId: req.user.studentId,
        association: req.user.association,
        isInternal: req.user.isInternal,
        permission: {
            administration: req.permission.administration
        }
    })
}

async function refresh(req: CustomRequest, res: Response, next: NextFunction) {
    const { token } = req.query;

    const userIdInString = await new TokenManager().getAndDelRefreshToken(String(token));

    if (userIdInString instanceof Error || typeof userIdInString !== 'string') {
        return res.status(HttpStatusCode.Unauthorized).json({
            message: 'Invalid refresh token',
        });
    }

    const account = await userRepository.findUserById(
        String(userIdInString),
    );
    if (!account) {
        return res.status(HttpStatusCode.NotFound).json({
            message: '계정을 찾을 수 없습니다.',
        });
    }

    const newToken = await new TokenManager(account.id).generateTokenObject();

    res.json({
        accessToken: newToken.accessToken,
        refreshToken: newToken.refreshToken,
    });
}

export {
    signUp,
    signIn,
    signOut,
    getToken,
    getUserData,
    refresh
}
