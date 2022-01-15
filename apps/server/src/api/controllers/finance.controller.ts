import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import logger from '../../config/logger';
import redisClient from '../../config/redisClient';
import { CustomException } from '../utils/errors';

const prisma = new PrismaClient();

export const createController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const finance = await prisma.finance.create({
      data: {
        ...req.body,
      },
    });
    return res.status(201).json({
      status: 'success',
      payload: finance,
      message: 'Created successfully 🚀',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const findController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const finances = await redisClient.get('allFinance');
    if (finances !== null) {
      return res.status(200).json({
        status: 'success',
        payload: JSON.parse(finances),
        message: 'Operation successful',
      });
    }
    const allFinance = await prisma.finance.findMany();
    await redisClient.set('allFinance', JSON.stringify(allFinance));
    return res.status(200).json({
      status: 'success',
      payload: allFinance,
      message: 'Operation successful',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const findOneController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const cachedFinance = await redisClient.get(`finance${id}`);
    if (cachedFinance !== null) {
      return res.status(200).json({
        status: 'success',
        payload: JSON.parse(cachedFinance),
        message: 'Operation successful',
      });
    }
    const finance = await prisma.finance.findUnique({
      where: {
        id,
      },
    });
    await redisClient.set(`finance${id}`, JSON.stringify(finance));

    return res.status(200).json({
      status: 'success',
      payload: finance,
      message: 'Operation successful',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const countController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const numOfFinance = await prisma.finance.count();
    return res.status(200).json({
      status: 'success',
      payload: numOfFinance,
      message: 'Operation successful',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const updateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const finance = await prisma.finance.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json({
      status: 'success',
      payload: finance,
      message: 'Updated successfully 🚀',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const removeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.finance.delete({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Deleted successfully 🚀',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};
