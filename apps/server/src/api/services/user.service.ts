import { PrismaClient } from '@prisma/client';
import { NextFunction } from 'express';
import logger from '../../config/logger';
import { CustomException } from '../utils/errors';

const prisma = new PrismaClient();

export const isUser = async (email: string, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user !== null;
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export default isUser;
