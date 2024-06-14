import * as redis from 'redis';
import env from '../../module/dotenv';

const redisClient = redis.createClient({
    url: `redis://@${env.REDIS_HOST}:${env.REDIS_PORT}`,
    readonly: false,
});

redisClient.on('connect', () => console.log('redis connected'));
redisClient.on('error', err => console.error('redis error', err.stack));

export default redisClient;
