import database from "../../infra/connector/database";
import UserEntity from "./user.entity";
import {isUUID} from "class-validator";
import permissionRepository from "../permission/permission.repository";
import {encryptPassword} from "../../infra/module/crypto";

const userRepository = database.source.getRepository(UserEntity).extend({
    async createAccount({name, studentId, email, phone, isInternal, password}: {
        name: string,
        studentId: number,
        email: string,
        phone: string,
        isInternal: boolean,
        password: string
    }){
        const _userEntity = new UserEntity(studentId, name, email, phone, isInternal, null)
        const account = await this.save(_userEntity);

        await permissionRepository.initNewPermissionObject(account.id);
        account.password = await this.updatePassword(account, password);

        return account;
    },

    async getAllUsers(): Promise<UserEntity[]> {
        return await this.find({
            select: ['studentId', 'name', 'isInternal', 'id', 'isActive']
        });
    },

    async findUserById(id: string): Promise<UserEntity | null> {
        if(!isUUID(id)) return null;
        return await this.findOneById(id);
    },

    async findAccount(email: string, password: string): Promise<UserEntity | null> {
        const _account = await this.findOne({
            where: {
                email: email
            }
        });
        if(!_account) return null;

        return await this.findOne({
            where: {
                email: email,
                password: encryptPassword(_account.id, _account.name, password)
            }
        });
    },

    async updatePassword(account: UserEntity, password: string) {
        const hash = encryptPassword(account.id, account.name, password);
        await this.update(account.id, {
            password: hash
        })
        return hash;
    },

    async findById(id: string) {
        if(!isUUID(id)) return null;
        return await this.findOneById(id);
    },

    async findByNameAndStudentId(name: string, studentId: number): Promise<UserEntity | null> {
        if(typeof name !== 'string' || typeof studentId !== "number") return null;
        return await this.findOne({
            where: {
                name: name,
                studentId: studentId
            }
        })
    },

    async findByStudentId(studentId: string): Promise<UserEntity | null> {
        if(typeof studentId !== "number") return null;
        return await this.findOne({
            where: {
                studentId: studentId
            }
        })
    }
})

export default userRepository;
