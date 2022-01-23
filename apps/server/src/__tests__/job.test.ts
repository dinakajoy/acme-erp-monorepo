/* eslint-disable jest/no-export */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-unresolved */
import supertest from 'supertest';
import dotenv from 'dotenv-safe';
import app from '../app';

dotenv.config();

const newJobData = {
  name: 'Garbage Export',
  startDate: '2021/11/04',
  endDate: '2021/12/04',
  fileNo: '0001/ACME',
  clientId: '61adee1de19981adcdd82ccd',
  status: 'on-going',
  createdBy: 'administration',
  updatedBy: 'Odinaka Joy',
};

let id = '';
export default id;

describe('job', () => {
  // job registration
  describe('job registration', () => {
    describe('given that you are not authenticated', () => {
      it('should return an unauthenticated error', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/jobs')
          .set('Accept', 'application/json')
          .send(newJobData);

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
          .post('/api/jobs')
          .set('Accept', 'application/json')
          .set('authorization', process.env.WRONG_JWT_DATA || '')
          .send(newJobData);

        expect(statusCode).toBe(500);
      });
    });

    describe('given all data are complete', () => {
      it('should return the job payload', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/jobs')
          .set('Accept', 'application/json')
          .set('authorization', process.env.JWT_DATA || '')
          .send(newJobData);

        id = body.payload.id;

        expect(statusCode).toBe(201);
      });
    });
  });

  // get all jobs
  describe('given that you want to view all jobs', () => {
    it('should return all registered jobs payload', async () => {
      const { statusCode } = await supertest(app).get('/api/jobs');

      expect(statusCode).toBe(200);
    });
  });

  // get single job
  describe('given that you want to view a particular job', () => {
    it('should return job with the below id', async () => {
      const { statusCode } = await supertest(app).get(`/api/jobs/${id}`);

      expect(statusCode).toBe(200);
    });
  });

  // update single job
  describe('given that you want to update a particular job', () => {
    it('should update and return job with the below id', async () => {
      const { statusCode } = await supertest(app)
        .put(`/api/jobs/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '')
        .send(newJobData);

      expect(statusCode).toBe(200);
    });
  });

  // delete single job
  describe('given that you want to delete a particular job', () => {
    it('should delete job with the below id', async () => {
      const { statusCode, body } = await supertest(app)
        .delete(`/api/jobs/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '');

      id = '';
      expect(statusCode).toBe(200);
      expect(body).toEqual({
        status: 'success',
        message: 'Job deleted successfully 🚀',
      });
    });
  });
});
