import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validation = () => [
  body('createdBy').isLength({ min: 3 }).trim().escape(),
  body('updatedBy').isLength({ min: 2 }).trim().escape(),
  body('name').isLength({ min: 3 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isInt().isLength({ min: 11, max: 11 }).trim().escape(),
  body('address').isLength({ min: 2 }).trim().escape(),
  body('company').isLength({ min: 2 }).trim().escape(),
  body('contactPerson').isLength({ min: 2 }).trim().escape(),
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
