/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import nodemailer from 'nodemailer';
import { NextFunction } from 'express';
import dotenv from 'dotenv-safe';
import logger from '../../config/logger';
import { IMailData } from '../interfaces/maildata';
import { CustomException } from '../utils/errors';

dotenv.config();

const mail = async (
  mailData: IMailData,
  next: NextFunction
): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: process.env.SENDER_HOST,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
    secure: true,
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        logger.error(err.message);
        return next(
          new (CustomException as any)(500, 'Operation unsuccessful')
        );
      }
      return resolve(true);
    });
  });
};

export default mail;
