import database from '../../infra/connector/database';
import moment from 'moment';
import ApplyEntity from "./apply.entity";
import {IsNumber, isUUID} from 'class-validator';
import {InterestsForm} from "../../interfaces/apply/form";
import {IsNull, Not} from "typeorm";

const applyRepository = database.source.getRepository(ApplyEntity).extend({
    async findApplicationById(id: string) {
        if (!isUUID(id)) return null;
        return await this.findOne({
            withDeleted: true,
            where: {
                id: id,
            }
        })
    },

    async getApplicationStatus() {
        return {
            created: await this.count(),
            submitted: await this.count({
                where: {
                    isSubmitted: true
                }
            }),
            processed: await this.count({
                withDeleted: true,
                where: {
                    processedAt: Not(IsNull())
                }
            })
        }
    },

    async findApplicationByRequestedIp(ip: string): Promise<ApplyEntity> {
        return await this.findOne({
            where: {
                withDeleted: true,
                requestedIp: ip
            }
        })
    },

    async isEligible(ip: string): Promise<boolean> {
        return (await this.count({
            withDeleted: true,
            where: [
                {requestedIp: ip},
                {permittedIp: ip},
            ]
        })) <= 0;
    },

    async updateApplicationResult(id: string, result: boolean) {
        await this.update(id, {
            result: result
        });
        return await this.softDelete(id);
    },

    async getAllApplications({submitted, processed}: {
        submitted?: boolean,
        processed?: boolean
    }): Promise<ApplyEntity[]> {
        const options: {
            [id: string]: any
        } = {};

        if (typeof submitted === 'boolean') options['isSubmitted'] = submitted;
        if (typeof processed === 'boolean') options['result'] = processed ? Not(IsNull()) : IsNull();

        return await this.find({
            withDeleted: true,
            where: options,
            select: ['id', 'name', 'studentId', 'isSubmitted', 'result']
        });
    },

    async setPermittedIp(_application: string | ApplyEntity, ip: string): Promise<boolean> {
        const application: ApplyEntity = typeof _application === 'string' ? await this.findApplicationById(_application) : _application;
        if (!application) return false;

        if (application.permittedIp) return false;

        await this.update(application.id, {
            permittedIp: ip
        });
        return true;
    },

    async updateApplication(application: ApplyEntity, interests: InterestsForm, projects: string, resolution: string): Promise<void> {
        return await this.update(application.id, {
            interests: interests,
            projects: projects,
            resolution: resolution,
            isSubmitted: true
        })
    },

    async isIpRequestable(ip: string): Promise<boolean> {
        const count = await this.count({
            where: {
                requestedIp: ip
            }
        });
        return count <= 0;
    },

    async addApplication({studentId, name, email, phone, requestedIp}: {
        studentId: string,
        name: string,
        email: string,
        phone: string,
        requestedIp: string
    }) {
        if (!await this.isIpRequestable(requestedIp)) {
            throw new Error('This IP Already submitted');
        }

        const _application: ApplyEntity = new ApplyEntity(Number(studentId), name, email, phone, requestedIp, {}, null, null);
        const application: ApplyEntity = this.save(_application);
        return application;
    }
})

export default applyRepository;
