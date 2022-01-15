import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const loginValidation = () => [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }),
];

export const forgetPasswordValidation = () => [
  body('email').isEmail().normalizeEmail(),
];

export const resetPasswordValidation = () => [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 5 }).isStrongPassword(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).json({
    status: 'error',
    errors: errors.array(),
  });
};
