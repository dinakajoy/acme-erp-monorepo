/* eslint-disable jest/no-export */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-unresolved */
import supertest from 'supertest';
import dotenv from 'dotenv-safe';
import app from '../app';

dotenv.config();

const newFinanceData = {
  requester: 'Odinaka Joy',
  status: 'unconfirmed',
  completed: 'unconfirmed',
  contactPerson: 'administration',
  userId: '61a5d35cb54a74053545ea01',
  createdBy: 'administration',
  updatedBy: 'Odinaka Joy',
};

let id = '';
export default id;

describe('finance', () => {
  // finance registration
  describe('finance registration', () => {
    describe('given that you are not authenticated', () => {
      it('should return an unauthenticated error', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/finance')
          .set('Accept', 'application/json')
          .send(newFinanceData);

        expect(statusCode).toBe(403);
        expect(body).toMatchObject({
          errors: 'Please login or create an account',
          status: 'error',
        });
      });
    });

    describe('given that you are logged in as with an expired or invalid token', () => {
      it('should return an unauthorized error', async () => {
        const { statusCode } = await supertest(app)
          .post('/api/finance')
          .set('Accept', 'application/json')
          .set('authorization', process.env.WRONG_JWT_DATA || '')
          .send(newFinanceData);

        expect(statusCode).toBe(500);
      });
    });

    describe('given all data are complete', () => {
      it('should return the finance payload', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/finance')
          .set('Accept', 'application/json')
          .set('authorization', process.env.JWT_DATA || '')
          .send(newFinanceData);

        id = body.payload.id;

        expect(statusCode).toBe(201);
      });
    });
  });

  // get all finances
  describe('given that you want to view all finances', () => {
    it('should return all registered finances payload', async () => {
      const { statusCode } = await supertest(app).get('/api/finance');

      expect(statusCode).toBe(200);
    });
  });

  // get single finance
  describe('given that you want to view a particular finance', () => {
    it('should return finance with the below id', async () => {
      const { statusCode } = await supertest(app).get(`/api/finance/${id}`);

      expect(statusCode).toBe(200);
    });
  });

  // update single finance
  describe('given that you want to update a particular finance', () => {
    it('should update and return finance with the below id', async () => {
      const { statusCode } = await supertest(app)
        .put(`/api/finance/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '')
        .send(newFinanceData);

      expect(statusCode).toBe(200);
    });
  });

  // delete single finance
  describe('given that you want to delete a particular finance', () => {
    it('should delete finance with the below id', async () => {
      const { statusCode, body } = await supertest(app)
        .delete(`/api/finance/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '');

      id = '';
      expect(statusCode).toBe(200);
      expect(body).toEqual({
        status: 'success',
        message: 'Deleted successfully 🚀',
      });
    });
  });
});
