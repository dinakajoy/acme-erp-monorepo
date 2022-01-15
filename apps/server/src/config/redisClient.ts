import Redis from 'ioredis';
import logger from './logger';

const redisClient = new Redis();

redisClient.on('connect', () => logger.info('Redis Connected!'));
redisClient.on('error', (err) => logger.error('Redis Client Error: ', err));

export default redisClient;
