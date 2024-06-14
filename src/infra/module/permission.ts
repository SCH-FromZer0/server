import {PermissionEntity} from "../../domain";
import {Permissions} from "../../interfaces/account/permission";
import {CustomRequest} from "../middleware/express";
import {NextFunction, Response} from "express";
import {HttpStatusCode} from "axios";

function dec2bin(dec: number): boolean[] {
    return (dec >>> 0).toString(2).split('').map(elem => Boolean(Number(elem)));
}

function readPermission(permission: PermissionEntity): Permissions {
    const permissions: Permissions = {
        administration: {
            base: false,
            master: false
        }
    };

    // administration
    const _administration = dec2bin(permission.administration);
    permissions.administration = {
        base: _administration[0],
        master: _administration[1]
    }

    return permissions;
}

function permissionForbidden(req: CustomRequest, res: Response) {
    return res.status(HttpStatusCode.Forbidden).send({message: '이 작업을 수행하기에는 권한 수준이 부족한 것 같아요.'});
}

export {
    readPermission,
    permissionForbidden
}
