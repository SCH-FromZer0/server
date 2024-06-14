import {CustomRequest} from "../../infra/middleware/express";
import {Response, NextFunction} from "express";
import {userRepository} from "../../domain";

async function getAllAccounts(req: CustomRequest, res: Response, next: NextFunction) {
    return res.json(await Promise.all((await userRepository.getAllUsers()).map(user => {
        return {
            id: user.id,
            studentId: user.studentId,
            name: user.name,
            isInternal: user.isInternal,
            isActive: user.isActive
        }
    })) ?? []);
}

export {
    getAllAccounts
}
