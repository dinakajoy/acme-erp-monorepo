import * as express from 'express';
import ROLES_LIST from '../../config/roles_list';
import { validation, validate } from '../validations/finance.validation';
import {
  createController,
  findController,
  findOneController,
  countController,
  updateController,
  removeController,
} from '../controllers/finance.controller';
import isAuthorized from '../middlewares/isAuthorized';

const router = express.Router();

router.post(
  '/',
  validation(),
  validate,
  isAuthorized(ROLES_LIST.Account, ROLES_LIST.Administrator),
  createController
);
router.get('/', findController);
router.get('/count', countController);
router.get('/:id', findOneController);
router.put(
  '/:id',
  validation(),
  validate,
  isAuthorized(ROLES_LIST.Account, ROLES_LIST.Administrator),
  updateController
);
router.delete('/:id', isAuthorized(ROLES_LIST.Administrator), removeController);

export default router;
