/* eslint-disable @typescript-eslint/no-var-requires */
import session from 'express-session';
import logger from './logger';
import redisClient from './redisClient';

const RedisStore = require('connect-redis')(session);

const store = new RedisStore({ client: redisClient });

store.on('error', (error: any) => {
  logger.info(error);
});

export default store;
