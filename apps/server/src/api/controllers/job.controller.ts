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
    const job = await prisma.job.create({
      data: {
        ...req.body,
      },
    });
    return res.status(201).json({
      status: 'success',
      payload: job,
      message: 'Job created successfully 🚀',
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
    const clients = await redisClient.get('allJobs');
    if (clients !== null) {
      return res.status(200).json({
        status: 'success',
        payload: JSON.parse(clients),
        message: 'Operation successful',
      });
    }
    const allJobs = await prisma.job.findMany();
    await redisClient.set('allJobs', JSON.stringify(allJobs));
    return res.status(200).json({
      status: 'success',
      payload: allJobs,
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
    const cachedJob = await redisClient.get(`job${id}`);
    if (cachedJob !== null) {
      return res.status(200).json({
        status: 'success',
        payload: JSON.parse(cachedJob),
        message: 'Operation successful',
      });
    }
    const job = await prisma.job.findUnique({
      where: {
        id,
      },
    });
    await redisClient.set(`job${id}`, JSON.stringify(job));

    return res.status(200).json({
      status: 'success',
      payload: job,
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
    const numOfJobs = await prisma.job.count();
    return res.status(200).json({
      status: 'success',
      payload: numOfJobs,
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
    const job = await prisma.job.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json({
      status: 'success',
      payload: job,
      message: 'Job updated successfully 🚀',
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
    await prisma.job.delete({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Job deleted successfully 🚀',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};
