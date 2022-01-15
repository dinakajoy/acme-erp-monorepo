import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validation = () => [
  body('createdBy').isLength({ min: 3 }).trim().escape(),
  body('updatedBy').isLength({ min: 2 }).trim().escape(),
  body('name').isLength({ min: 3 }).trim().escape(),
  body('startDate').isDate().isLength({ min: 2 }).trim().escape(),
  body('endDate').isDate().isLength({ min: 2 }).trim().escape(),
  body('status')
    .isIn(['on-going', 'completed', 'yet-to-start', 'abandoned'])
    .trim()
    .escape(),
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
