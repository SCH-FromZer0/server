import database from "../../infra/connector/database";
import PermissionEntity from "./permission.entity";
import {isUUID} from "class-validator";

const permissionRepository = database.source.getRepository(PermissionEntity).extend({
    async initNewPermissionObject (userId: string): Promise<boolean | null> {
        if (!isUUID(userId)) return null;

        const permObject = new PermissionEntity(userId);
        return this.save(permObject);
    },

    async getPermissionByUserId(userId: string): Promise<PermissionEntity | null> {
        if (!isUUID(userId)) return null;
        return this.findOneById(userId);
    },

    async readPermission (userId: string) {
        if (!isUUID(userId)) return null;
        return this.findOneById(userId);
    },
})

export default permissionRepository;
