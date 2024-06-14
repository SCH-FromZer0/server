import {NextFunction, Response} from "express";
import {CustomRequest} from "../../infra/middleware/express";
import applyRepository from "../../domain/apply/apply.repository";
import ApplyEntity from "../../domain/apply/apply.entity";
import {isUUID} from "class-validator";
import {HttpStatusCode} from "axios";
import {sendApplication, sendApplicationSubmitted} from "./apply.mailer";
import {ApplyRequest} from "../../infra/middleware/express/Request";
import {ApplicationFormInput} from "../../interfaces/apply/form";
import {permissionForbidden} from "../../infra/module/permission";
import configRepository from "../../domain/config/config.repository";
import {logIncident} from "../../infra/middleware/logger/incident";

async function isEligible(req: CustomRequest, res: Response) {
    const application = await applyRepository.isEligible(req.clientIp);
    return res.status(application ? 200 : 403).json({eligible: application});
}

async function validateApplication(req: ApplyRequest, res: Response, next: NextFunction) {
    res.json({
        valid: true,
        verified: !!(req.application.permittedIp && req.application.permittedIp.trim() === req.clientIp),
        submitted: req.application.isSubmitted,
        sameIp: req.application.requestedIp.trim() === req.clientIp
    });
}

async function readApplication(req: ApplyRequest, res: Response, next: NextFunction) {
    return res.json({
        isSubmitted: req.application.isSubmitted,
        interests: req.application.interests,
        resolution: req.application.resolution ?? '',
        projects: req.application.projects ?? ''
    })
}

async function updateApplication(req: ApplyRequest, res: Response, next: NextFunction) {
    function arrayFormatter(input: any): string[] {
        return Array.isArray(input) ? [...new Set(input)].map(item => item.trim()) : [];
    }

    const body = req.body as ApplicationFormInput;
    const form: ApplicationFormInput = {
        interests: {
            study: {
                dev: {
                    part: arrayFormatter(body.interests.study.dev.part),
                    stack: arrayFormatter(body.interests.study.dev.stack),
                },
                sec: {
                    part: arrayFormatter(body.interests.study.sec.part),
                    stack: arrayFormatter(body.interests.study.sec.stack),
                },
                other: arrayFormatter(body.interests.study.other)
            },
            curriculum: arrayFormatter(body.interests.curriculum)
        },
        projects: body.projects,
        resolution: body.resolution
    }

    try {
        await applyRepository.updateApplication(req.application, form.interests, form.projects, form.resolution);
    } catch (e) {
        return res.status(HttpStatusCode.InternalServerError).json({
            success: false
        })
    }

    if(!req.application.isSubmitted) {
        await sendApplicationSubmitted(req.application, req.clientIp);
    }

    return res.json({
        success: true
    })
}

async function authApplication(req: CustomRequest, res: Response, next: NextFunction) {
    const applicationId = req.params.applicationId;
    if(!isUUID(applicationId)) return next();

    try {
        await new Promise((resolve, reject) => {
            ['name', 'studentId', 'phone', 'email'].map(key => {
                if(!req.body[key] || typeof req.body[key] !== 'string' || req.body[key] === '') return reject();
            })
            if(isNaN(req.body.studentId)|| !req.body.studentId.startsWith('20') || !req.body.email.endsWith('@gmail.com')) return reject();
            resolve(true);
        })
    } catch (err) {
        return next();
    }

    const application: ApplyEntity = await applyRepository.findApplicationById(applicationId);
    if(!application) return res.status(HttpStatusCode.NotFound).json({
        message: '이 지원서는 삭제됐거나 원래부터 존재하지 않았던 것 같아요!'
    })

    if(application.permittedIp){
        return res.status(HttpStatusCode.Forbidden).json({
            message: '이미 인증된 지원서는 다시 인증할 수 없어요.'
        })
    }

    if(
        req.body.name === application.name.trim() &&
        Number(req.body.studentId) === application.studentId &&
        req.body.phone === application.phone.trim()
        && req.body.email === application.email.trim()
    ) applyRepository.setPermittedIp(application, req.clientIp).then(result => {
        if(result) res.json({
            success: true
        })
        else res.status(HttpStatusCode.InternalServerError).json({
            message: '지원서 업데이트에 실패했어요.'
        })
    })
    else return res.status(HttpStatusCode.Forbidden).json({
        message: '인증 정보가 지원자 정보가 일치하지 않은 것 같아요.'
    })
}

async function requestForm(req: CustomRequest, res: Response, next: NextFunction) {
    if(Object.keys(req.body).length > 4) return next();
    if(!await applyRepository.isIpRequestable(req.clientIp)) {
        return res.status(HttpStatusCode.Forbidden).json({
            message: 'ALREADY_REQUESTED'
        })
    }

    try {
        await new Promise((resolve, reject) => {
            ['name', 'studentId', 'phone', 'email'].map(key => {
                if(!req.body[key] || typeof req.body[key] !== 'string' || req.body[key] === '') return reject();
            })
            if(isNaN(req.body.studentId)|| !req.body.studentId.startsWith('20') || !req.body.email.endsWith('@gmail.com')) return reject();
            resolve(true);
        })
    } catch (err) {
        return next();
    }

    let application: ApplyEntity;
    try {
        application = await applyRepository.addApplication({
            studentId: req.body.studentId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            requestedIp: req.clientIp
        })
    } catch (e) {
        return res.status(403).json({
            message: 'ALREADY_REQUESTED'
        })
    }

    if(await sendApplication(application)) return res.json({
        success: true,
    });
    else return res.status(HttpStatusCode.InternalServerError).json({
        success: false,
        message: 'ERR_UNKNOWN'
    });
}

export {
    isEligible,
    validateApplication,
    readApplication,
    updateApplication,
    authApplication,
    requestForm
}

