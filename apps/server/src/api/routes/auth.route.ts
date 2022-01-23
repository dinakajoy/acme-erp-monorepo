import * as express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import acountLimiter from '../middlewares/rateLimiterForLogin';
import {
  loginValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
  validate,
} from '../validations/auth.validation';
import {
  loginController,
  forgotPasswordController,
  resetPasswordController,
  refreshTokenController,
  logoutController,
} from '../controllers/auth.controller';

const router = express.Router();

router.post(
  '/login',
  acountLimiter,
  loginValidation(),
  validate,
  loginController
);
router.post(
  '/forgot-password',
  acountLimiter,
  forgetPasswordValidation(),
  validate,
  forgotPasswordController
);
router.put(
  '/reset-password',
  resetPasswordValidation(),
  validate,
  isAuthenticated,
  resetPasswordController
);

router.get('/refresh-token', refreshTokenController);
router.get('/logout', logoutController);

export default router;
