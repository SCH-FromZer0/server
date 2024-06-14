import {CustomRequest} from "./Request";
import { Response, NextFunction } from 'express';

export function getEndUserIP(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) {
    let ipFromRequest = req.ip;
    if (ipFromRequest.substring(0, 7) == '::ffff:') {
        ipFromRequest = ipFromRequest.substring(7);
    }
    req.endUserIp = ipFromRequest;
    next();
}
