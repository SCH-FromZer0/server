import {NextFunction, Response} from "express";
import { ApplyRequest } from "../../infra/middleware/express/Request";
import {isUUID} from "class-validator";
import ApplyEntity from "../../domain/apply/apply.entity";
import applyRepository from "../../domain/apply/apply.repository";
import {HttpStatusCode} from "axios";
import {logIncident} from "../../infra/middleware/logger/incident";

async function checkApplication(req: ApplyRequest, res: Response, next: NextFunction) {
    const applicationId = req.params.applicationId;
    const isRequestedByManager = req.permission && (req.permission.administration.base || req.permission.administration.master);
    if(!isUUID(applicationId)) return logIncident(req, res, next);

    const application: ApplyEntity = await applyRepository.findApplicationById(applicationId);
    if(!application) return res.status(HttpStatusCode.NotFound).json({
        message: '이 지원서는 삭제됐거나 원래부터 존재하지 않았던 것 같아요!'
    })

    if((application.permittedIp && application.permittedIp.trim() !== req.clientIp) && !isRequestedByManager)
        return res.status(HttpStatusCode.Unauthorized).json({
            message: '이미 다른 IP에서 인증된 지원서로\n인증한 IP에서만 작성이 가능해요'
        })

    req.application = application;

    next();
}


export {
    checkApplication
}
