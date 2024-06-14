import {CustomRequest} from "../../infra/middleware/express";
import {NextFunction, Response} from "express";
import {isUUID} from "class-validator";
import {logIncident} from "../../infra/middleware/logger/incident";
import {permissionForbidden} from "../../infra/module/permission";
import applyRepository from "../../domain/apply/apply.repository";
import {HttpStatusCode} from "axios";
import configRepository from "../../domain/config/config.repository";
import {ApplyEntity, invitationRepository} from "../../domain";
import {sendResult} from "./apply.mailer";
import {sendInvitation} from "../invitation/invitation.mailer";

function applicationFormatter(applications: ApplyEntity[]) {
    return applications.map(application => {
        return {
            id: application.id,
            name: application.name,
            studentId: application.studentId,
            isSubmitted: application.isSubmitted,
            result: application.result
        }
    });
}

async function getApplyBrief(req: CustomRequest, res: Response, next: NextFunction) {
    const _result = await applyRepository.getApplicationStatus();
    const applyConfig = await configRepository.findOneOrInit('apply');

    const result = {
        recruit: applyConfig.data.isAppliable,
        created: _result.created,
        submitted: _result.submitted,
        processed: _result.processed,
    }

    res.json(result);
}

async function getAllApplications(req: CustomRequest, res: Response, next: NextFunction) {
    res.json(applicationFormatter(await applyRepository.getAllApplications({})));
}

async function getAllSubmittedApplications(req: CustomRequest, res: Response, next: NextFunction) {
    res.json(applicationFormatter(await applyRepository.getAllApplications({
        submitted: true,
        processed: false
    })));
}

async function getAllProcessedApplications(req: CustomRequest, res: Response, next: NextFunction) {
    res.json(applicationFormatter(await applyRepository.getAllApplications({
        submitted: true,
        processed: true
    })));
}

async function readApplicationByManager(req: CustomRequest, res: Response, next: NextFunction) {
    const applicationId = req.params.applicationId;
    if(!isUUID(applicationId)) return logIncident(req, res, next);

    const application = await applyRepository.findApplicationById(applicationId);
    if(!application) return res.status(HttpStatusCode.NotFound).json({
        message: '지원서를 찾을 수 없습니다,'
    });
    else return res.json(application)
}

async function processApplication(req: CustomRequest, res: Response, next: NextFunction) {
    const applicationId = req.params.applicationId;
    if(!isUUID(applicationId)) return logIncident(req, res, next);

    const application: ApplyEntity | null = await applyRepository.findApplicationById(applicationId);
    if(!application) return res.status(HttpStatusCode.NotFound).json({
        message: '지원서를 찾을 수 없습니다,'
    });

    if(application.result !== null) return res.status(HttpStatusCode.Forbidden).json({
        message: '이미 처리된 지원서입니다.'
    });

    if(typeof req.body.result !== 'boolean') return res.status(HttpStatusCode.Forbidden).json({
        message: '올바르지 않은 요청입니다.'
    });

    const result = Boolean(req.body.result);

    await applyRepository.updateApplicationResult(applicationId, result);

    await sendResult(application, result);

    if (result) {
        const invitation = await invitationRepository.addFromApplication(application);
        await sendInvitation(invitation);
    }

    return res.json({
        message: '정상적으로 반영되었습니다.'
    })
}


export {
    getApplyBrief,
    getAllApplications,
    readApplicationByManager,
    getAllSubmittedApplications,
    getAllProcessedApplications,
    processApplication
}
