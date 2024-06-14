import database from '../../infra/connector/database';
import ConfigEntity from "./config.entity";
import {ConfigId, ConfigValue} from "../../interfaces/config/key";
import fs from "node:fs";

const configRepository = database.source.getRepository(ConfigEntity).extend({
    async findOneOrInit(configId: ConfigId) {
        let result = await this.findOne({
            where: {
                name: configId
            }
        })
        if(!result) result = await this.initConfig(configId);

        return result;
    },

    async initConfig(configId: ConfigId) {
        try {
            const config: ConfigValue = JSON.parse(fs.readFileSync(process.cwd() + `/setup/config/${configId}.json`, 'utf-8'));
            return await this.save(new ConfigEntity(configId, config));
        } catch (e) {
            return null;
        }
    },
});

export default configRepository;
