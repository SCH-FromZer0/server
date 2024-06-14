import { CustomRequest } from '../express';
import { NextFunction, Response } from 'express';
import { HttpStatusCode } from 'axios';
import TokenManager from '../../module/token';
import {permissionRepository, userRepository} from '../../../domain';
import {readPermission} from "../../module/permission";

async function validateAccessToken(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) {
    try {
        const accessToken = String(req.header('Authorization') ?? '').replace(
            /^Bearer /,
            '',
        );

        const id: string | Error = await new TokenManager().validateAccessToken(
            accessToken,
        );

        if (id instanceof Error) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: '토큰이 변조되었거나 만료되어 인증에 실패했어요.',
            });
        }

        const user = await userRepository.findUserById(id);
        if (!user) {
            return res.status(HttpStatusCode.NotFound).json({
                message: '토큰에 연결된 계정을 찾을 수 없어요.',
            });
        }

        const permission = await permissionRepository.getPermissionByUserId(user.id);
        if (!permission) {
            return res.status(HttpStatusCode.NotFound).json({
                message: '계정 권한 수준 확인에 실패했어요.',
            });
        }

        req.user = user;
        req.permission = readPermission(permission);

        next();
    } catch (e) {
        return res.status(HttpStatusCode.Forbidden).json({
            message: 'F',
        });
    }
}

export { validateAccessToken };
