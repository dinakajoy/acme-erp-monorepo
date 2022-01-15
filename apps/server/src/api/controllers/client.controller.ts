import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv-safe';
import redisClient from '../../config/redisClient';
import logger from '../../config/logger';
import { CustomException } from '../utils/errors';
import isClient from '../services/client.service';

const prisma = new PrismaClient();

dotenv.config();

export const createController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const existingClient = await isClient(req.body.email, next);
  if (existingClient) {
    return next(new (CustomException as any)(400, 'Client already exist'));
  }
  try {
    const client = await prisma.client.create({
      data: {
        ...req.body,
      },
    });
    return res.status(201).json({
      status: 'success',
      payload: client,
      message: 'Client created successfully 🚀',
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
    const clients = await redisClient.get('allClients');
    if (clients !== null) {
      return res.status(200).json({
        status: 'success',
        payload: JSON.parse(clients),
        message: 'Operation successful',
      });
    }
    const allClients = await prisma.client.findMany();
    await redisClient.set('allClients', JSON.stringify(allClients));
    return res.status(200).json({
      status: 'success',
      payload: allClients,
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
    const cachedClient = await redisClient.get(`client${id}`);
    if (cachedClient !== null) {
      return res.status(200).json({
        status: 'success',
        payload: JSON.parse(cachedClient),
        message: 'Operation successful',
      });
    }
    const client = await prisma.client.findUnique({
      where: {
        id,
      },
    });
    await redisClient.set(`client${id}`, JSON.stringify(client));
    return res.status(200).json({
      status: 'success',
      payload: client,
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
    const numOfClients = await prisma.user.count();
    return res.status(200).json({
      status: 'success',
      payload: numOfClients,
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
    const client = await prisma.client.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json({
      status: 'success',
      payload: client,
      message: 'Client updated successfully 🚀',
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
    await prisma.client.delete({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Client deleted successfully 🚀',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};
