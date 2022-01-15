/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';
import { JwtPayload } from 'jsonwebtoken';
import {
  signAccessToken,
  verifyAccessToken,
  hashPassword,
  comparePassword,
} from '../utils/helpers';
import {
  IEmployeeWithoutPasswordAndRole,
  IEmployee,
} from '../interfaces/employee';
import {
  InvalidException,
  CustomException,
  UnauthorizedException,
} from '../utils/errors';
import mail from '../services/mail.service';
import { ICreateToken } from '../interfaces/token';
import logger from '../../config/logger';
import store from '../../config/sessionStore';

const prisma = new PrismaClient();

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new (InvalidException as any)());
  }
  const checkPassword = await comparePassword(password, user.password, next);
  if (!checkPassword) {
    return next(new (InvalidException as any)());
  }
  const createAccessToken: ICreateToken = {
    employeeInfo: {
      email: user.email,
      role: user.role,
    },
    isRefreshToken: false,
  };
  const createRefreshToken: ICreateToken = {
    employeeInfo: {
      email: user.email,
      role: user.role,
    },
    isRefreshToken: true,
  };
  const result: IEmployeeWithoutPasswordAndRole = omit(user, [
    'password',
    'role',
  ]);
  const accessToken = await signAccessToken(createAccessToken, next);
  const refreshToken = await signAccessToken(createRefreshToken, next);
  req.session.isAuthenticated = refreshToken;
  return res.status(200).json({
    status: 'success',
    payload: { ...result, accessToken },
    message: 'Operation successful',
  });
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    // This is returned like this to prevent hackers from confirming unregistered emails
    return res.status(200).json({
      status: 'success',
      message: 'Please check your mail',
    });
  }
  const createToken: ICreateToken = {
    employeeInfo: {
      email: user.email,
      role: user.role,
    },
    isRefreshToken: false,
  };
  const accessToken = await signAccessToken(createToken, next);
  const mailData = {
    from: process.env.SENDER_EMAIL || 'mymail@mail.com',
    to: user.email,
    subject: 'Sending Email using Node.js',
    html: `<b>Hey there! <br> This is our first message sent with Nodemailer<br/> ${accessToken}`,
  };
  await mail(mailData, next);
  return res.status(200).json({
    status: 'success',
    message: 'Please check your mail',
  });
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password, next);
    const updateUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
    if (updateUser !== null) {
      return res.status(200).json({
        status: 'success',
        message: 'Password updated successfully',
      });
    }
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isAuthenticated } = req.session;
  if (!isAuthenticated) return next(new (UnauthorizedException as any)());

  store.get(req.sessionID, async (err: any, foundUser: IEmployee) => {
    if (!foundUser) {
      return next(new (InvalidException as any)());
    }

    // evaluate jwt
    const decodedToken: JwtPayload | undefined = await verifyAccessToken(
      { token: isAuthenticated, isRefreshToken: true },
      next
    );
    if (decodedToken) {
      const createAccessToken: ICreateToken = {
        employeeInfo: {
          email: decodedToken.email,
          role: decodedToken.role,
        },
        isRefreshToken: false,
      };
      const accessToken = await signAccessToken(createAccessToken, next);
      return res.status(200).json({
        status: 'success',
        payload: accessToken,
        message: 'Operation successful',
      });
    }
  });
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error(err.message);
      return next(new (CustomException as any)(500, 'Operation unsuccessful'));
    }
    return res.status(200).json({
      status: 'success',
      message: 'Operation successful',
    });
  });
};
