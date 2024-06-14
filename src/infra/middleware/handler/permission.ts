import {CustomRequest} from "../express";
import {Response, NextFunction} from "express";
import {permissionForbidden} from "../../module/permission";

async function isAdmin(req: CustomRequest, res: Response, next: NextFunction) {
    if(!req.permission) return permissionForbidden(req, res);
    if(req.permission.administration.base || req.permission.administration.master) return next();
    return permissionForbidden(req, res);
}

async function isMasterAdmin(req: CustomRequest, res: Response, next: NextFunction) {
    if(!req.permission) return permissionForbidden(req, res);
    if(req.permission.administration.master) return next();
    return permissionForbidden(req, res);
}

export {
    isAdmin,
    isMasterAdmin
}
