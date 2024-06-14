import {applyRepository, InvitationEntity, invitationRepository} from "../../domain";
import {CustomRequest} from "../../infra/middleware/express";
import {Response, NextFunction} from "express";
import {HttpStatusCode} from "axios";
import {sendInvitation} from "./invitation.mailer";

async function getInvitationBrief(req: CustomRequest, res: Response, next: NextFunction) {
    return res.json(await invitationRepository.getBrief());
}

async function getAllInvitations(req: CustomRequest, res: Response, next: NextFunction) {
    const _invitations: InvitationEntity[] = await invitationRepository.getAll(true);
    const invitations: {
        [id in keyof InvitationEntity]?: InvitationEntity[id];
    }[] = await Promise.all(_invitations.map(invitation => {
        return {
            id: invitation.id,
            name: invitation.name,
            studentId: invitation.studentId,
            association: invitation.association,
            isInternal: invitation.isInternal,
            isUsed: !!invitation.usedAt,
            isAddedManually: !!invitation.issuerId
        };
    }))
    return res.json(invitations);
}

async function createInvitationManually(req: CustomRequest, res: Response, next: NextFunction) {
    const {name, studentId, phone, email, isInternal, association}: {
        name: string,
        studentId: number | null,
        phone: string,
        email: string,
        isInternal: boolean,
        association?: string
    } = req.body;

    if (!isInternal && (typeof association !== 'string' || association === ''))
        return res.status(HttpStatusCode.Forbidden).json({
            message: '외부자의 경우, 소속을 필수적으로 입력해야 초대장 생성이 가능합니다.'
        })

    const existing = await invitationRepository.findExistingInvitation({
        name: name,
        studentId: studentId,
        phone: phone,
        email: email,
        mode: 'count',
        operator: 'or'
    });

    if (existing > 0) return res.status(HttpStatusCode.Forbidden).json({
        message: '이미 해당 대상자에 대한 초대장이 생성되어있습니다.'
    });

    const invitation = await invitationRepository.addManually({
        name: name,
        studentId: studentId,
        phone: phone,
        email: email,
        isInternal: isInternal,
        issuerId: req.user.id,
        association: !isInternal ? association : null
    });

    await sendInvitation(invitation);

    return res.json({
        message: `사용자 ${name}의 초대장이 생성되었습니다.`,
        id: invitation.id
    });
}

export {
    getInvitationBrief,
    getAllInvitations,
    createInvitationManually
}
