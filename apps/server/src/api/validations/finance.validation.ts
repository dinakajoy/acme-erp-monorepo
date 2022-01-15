import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validation = () => [
  body('createdBy').isLength({ min: 3 }).trim().escape(),
  body('contactPerson').isLength({ min: 2 }).trim().escape(),
  body('status')
    .isIn(['paid-in-full', 'paid-part', 'confirmed', 'unconfirmed'])
    .trim()
    .escape(),
  body('completed').isIn(['full', 'part', 'unconfirmed']).trim().escape(),
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
