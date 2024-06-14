import {CustomRequest} from "../express";
import {Response, NextFunction} from "express";

async function logIncident (req: CustomRequest, res: Response, next: NextFunction) {
    res.status(400).json({
        message: '잠재적 보안 위협으로 의심되는 요청이 감지되어 요청을 거부했어요. \n추후 조사를 위해 이 요청은 잠시 저장해둘게요!',
    })
}

export {
    logIncident
}
