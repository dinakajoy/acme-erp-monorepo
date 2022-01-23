import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import logger from '../../config/logger';
import redisClient from '../../config/redisClient';
import isUser from '../services/user.service';
import { hashPassword, signAccessToken } from '../utils/helpers';
import { CustomException } from '../utils/errors';
import { IEmployeeWithoutPasswordAndRole } from '../interfaces/employee';
import { ICreateToken } from '../interfaces/token';
import mail from '../services/mail.service';

const prisma = new PrismaClient();

export const createController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const existingUser = await isUser(email, next);
  if (existingUser) {
    return next(new (CustomException as any)(400, 'Employee already exist'));
  }
  const password = await hashPassword('Acme@2022', next);
  try {
    const createToken: ICreateToken = {
      employeeInfo: {
        email: req.body.email,
        role: req.body.role,
      },
      isRefreshToken: false,
    };
    const accessToken = await signAccessToken(createToken, next);
    const mailData = {
      from: process.env.SENDER_EMAIL || 'mymail@mail.com',
      to: email,
      subject: 'Imprtant Message From ACME Company',
      html: `<b>Hey there! <br> An account was just created for you. Please change your password <br/> <a href="${accessToken}">here</a>`,
    };
    const mailSent = await mail(mailData, next);
    if (!mailSent) {
      return next(new (CustomException as any)(500, 'Operation unsuccessful'));
    }

    const user = await prisma.user.create({
      data: {
        ...req.body,
        password,
      },
    });
    const result: IEmployeeWithoutPasswordAndRole = omit(user, [
      'role',
      'password',
    ]);

    return res.status(201).json({
      status: 'success',
      payload: result,
      message: 'Employee created successfully 🚀',
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
    const employees = await redisClient.get('allEmployees');
    if (employees !== null) {
      return res.status(200).json({
        status: 'success',
        payload: JSON.parse(employees),
        message: 'Operation successful',
      });
    }
    const allUsers: IEmployeeWithoutPasswordAndRole[] =
      await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          gender: true,
          department: true,
          street: true,
          town: true,
          state: true,
          country: true,
          createdBy: true,
          updatedBy: true,
        },
      });
    await redisClient.set('allEmployees', JSON.stringify(allUsers));
    return res.status(200).json({
      status: 'success',
      payload: allUsers,
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
    const cachedUser = await redisClient.get(`employee${id}`);
    if (cachedUser !== null) {
      return res.status(200).json({
        status: 'success',
        payload: JSON.parse(cachedUser),
        message: 'Operation successful',
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    const result: IEmployeeWithoutPasswordAndRole = omit(user, [
      'role',
      'password',
    ]);
    await redisClient.set(`employee${id}`, JSON.stringify(result));
    return res.status(200).json({
      status: 'success',
      payload: result,
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
    const numOfUsers = await prisma.user.count();
    return res.status(200).json({
      status: 'success',
      payload: numOfUsers,
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
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    const result: IEmployeeWithoutPasswordAndRole = omit(user, [
      'role',
      'password',
    ]);
    return res.status(200).json({
      status: 'success',
      payload: result,
      message: 'Employee updated successfully 🚀',
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
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Employee deleted successfully 🚀',
    });
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};
