/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { get } from 'lodash';
import dotenv from 'dotenv-safe';
import { verifyAccessToken } from '../utils/helpers';
import { NotFoundException, UnauthorizedException } from '../utils/errors';

dotenv.config();

const isAuthorized =
  (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      process.env.NODE_ENV === 'test'
        ? get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')
        : req.session?.isAuthenticated;
    if (!token) {
      return next(new (NotFoundException as any)());
    }
    const decodedToken: JwtPayload | undefined = await verifyAccessToken(
      { token, isRefreshToken: process.env.NODE_ENV !== 'test' },
      next
    );
    if (!decodedToken) {
      return next(new (UnauthorizedException as any)());
    }
    const { role } = decodedToken.payload;
    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(role);
    if (!result) {
      return next(new (UnauthorizedException as any)());
    }
    next();
  };

export default isAuthorized;
