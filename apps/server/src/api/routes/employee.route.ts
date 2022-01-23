import * as express from 'express';
import ROLES_LIST from '../../config/roles_list';
import acountLimiter from '../middlewares/rateLimiterForLogin';
import { validation, validate } from '../validations/employee.validation';
import {
  createController,
  findController,
  findOneController,
  countController,
  updateController,
  removeController,
} from '../controllers/employee.controller';
import isAuthorized from '../middlewares/isAuthorized';

const router = express.Router();

router.post(
  '/',
  acountLimiter,
  validation(),
  validate,
  isAuthorized(ROLES_LIST.HumanResource, ROLES_LIST.Administrator),
  createController
);
router.get('/', findController);
router.get('/count', countController);
router.get('/:id', findOneController);
router.put(
  '/:id',
  validation(),
  validate,
  isAuthorized(ROLES_LIST.HumanResource, ROLES_LIST.Administrator),
  updateController
);
router.delete('/:id', isAuthorized(ROLES_LIST.Administrator), removeController);

export default router;
