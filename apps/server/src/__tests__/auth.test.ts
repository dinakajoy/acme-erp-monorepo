/* eslint-disable import/no-unresolved */
import request from 'supertest';
import dotenv from 'dotenv-safe';
import app from '../app';

dotenv.config();

describe('employee', () => {
  // login
  describe('given that an employee wants to access their account', () => {
    it('should update and return employee with the below id', async () => {
      const { statusCode } = await request(app)
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'dinakajoy@gmail.com', password: 'Acme@909' });

      expect(statusCode).toBe(200);
    });
  });

  // forgot password - This has been removed because of email functionality
  // describe('given that an employee forgot their password', () => {
  //   it('should collect email address and send a reset password link', async () => {
  //     const { statusCode, body } = await request(app)
  //       .post('/auth/forgot-password')
  //       .set('Accept', 'application/json')
  //       .send({ email: 'dinakajoy@gmail.com' });
  //     expect(statusCode).toBe(200);
  //     expect(body).toEqual({
  //       status: 'success',
  //       message: 'Please check your mail',
  //     });
  //   });
  // });

  // reset password
  describe('given that an employee wants to reset their password', () => {
    it('should ensure employee used the reset password link sent to their email address', async () => {
      const { statusCode, body } = await request(app)
        .put('/auth/reset-password')
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '')
        .send({ email: 'dinakajoy@gmail.com', password: 'Acme@909' });
      expect(statusCode).toBe(200);
      expect(body).toEqual({
        status: 'success',
        message: 'Password updated successfully',
      });
    });
  });
});
