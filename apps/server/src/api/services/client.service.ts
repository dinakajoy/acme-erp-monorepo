import { PrismaClient } from '@prisma/client';
import { NextFunction } from 'express';
import logger from '../../config/logger';
import { CustomException } from '../utils/errors';

const prisma = new PrismaClient();

const isClient = async (name: string, next: NextFunction) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        name,
      },
    });
    return client !== null;
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export default isClient;
