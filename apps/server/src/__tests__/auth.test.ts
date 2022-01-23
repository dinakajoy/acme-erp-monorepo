/* eslint-disable import/no-unresolved */
import request from 'supertest';
import dotenv from 'dotenv-safe';
import app from '../app';

dotenv.config();

describe('employee', () => {
  // login
  describe('given that an employee wants to access their account', () => {
    it('using default password "Acme@2022" should return an arror', async () => {
      const { statusCode, body } = await request(app)
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'dinakajoy@gmail.com', password: 'Acme@2022' });

      expect(statusCode).toBe(400);
      expect(body).toEqual({
        status: 'error',
        message: 'Please reset your password',
      });
    });
  });

  // forgot password - This has been removed because of email functionality
  describe('given that an employee forgot their password', () => {
    it('should collect email address and send a reset password link', async () => {
      const { statusCode, body } = await request(app)
        .post('/auth/forgot-password')
        .set('Accept', 'application/json')
        .send({ email: 'dinakajoy@gmail.com' });
      expect(statusCode).toBe(200);
      expect(body).toEqual({
        status: 'success',
        message: 'Please check your mail',
      });
    });
  });
});
