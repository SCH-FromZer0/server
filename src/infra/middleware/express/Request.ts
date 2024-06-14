import { Request } from 'express';
import ApplyEntity from "../../../domain/apply/apply.entity";
import UserEntity from "../../../domain/user/user.entity";
import {Permissions} from "../../../interfaces/account/permission";

interface CustomRequest extends Request {
    user?: UserEntity | null;
    permission?: Permissions | null;
    endUserIp?: string;
    applicationId?: string
}

interface ApplyRequest extends CustomRequest {
    application: ApplyEntity
}

export type {
    CustomRequest,
    ApplyRequest
}
