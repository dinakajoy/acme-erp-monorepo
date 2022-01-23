/* eslint-disable jest/no-export */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-unresolved */
import supertest from 'supertest';
import dotenv from 'dotenv-safe';
import app from '../app';

dotenv.config();

const newClientData = {
  name: 'Odinaka3 Joy3',
  email: 'odinaka909@gmail.com',
  phone: '08027878998',
  company: 'acme oil company',
  contactPerson: 'Human Resource Head',
  address: '#3 Rumudara, Obigbo, Rivers, Nigeria',
  createdBy: 'administration',
  updatedBy: 'Odinaka Joy',
};

let id = '';
export default id;

describe('client', () => {
  // client registration
  describe('client registration', () => {
    describe('given that you are not authenticated', () => {
      it('should return an unauthenticated error', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/clients')
          .set('Accept', 'application/json')
          .send(newClientData);

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
          .post('/api/clients')
          .set('Accept', 'application/json')
          .set('authorization', process.env.WRONG_JWT_DATA || '')
          .send(newClientData);

        expect(statusCode).toBe(500);
      });
    });

    describe('given the email has not been registered', () => {
      it('should return the client payload', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/clients')
          .set('Accept', 'application/json')
          .set('authorization', process.env.JWT_DATA || '')
          .send(newClientData);

        id = body.payload.id;

        expect(statusCode).toBe(201);
      });
    });
  });

  // get all clients
  describe('given that you want to view all clients', () => {
    it('should return all registered clients payload', async () => {
      const { statusCode } = await supertest(app).get('/api/clients');

      expect(statusCode).toBe(200);
    });
  });

  // get single client
  describe('given that you want to view a particular client', () => {
    it('should return client with the below id', async () => {
      const { statusCode } = await supertest(app).get(`/api/clients/${id}`);

      expect(statusCode).toBe(200);
    });
  });

  // update single client
  describe('given that you want to update a particular client', () => {
    it('should update and return client with the below id', async () => {
      const { statusCode } = await supertest(app)
        .put(`/api/clients/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '')
        .send(newClientData);

      expect(statusCode).toBe(200);
    });
  });

  // delete single client
  describe('given that you want to delete a particular client', () => {
    it('should delete client with the below id', async () => {
      const { statusCode, body } = await supertest(app)
        .delete(`/api/clients/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '');

      id = '';
      expect(statusCode).toBe(200);
      expect(body).toEqual({
        status: 'success',
        message: 'Client deleted successfully 🚀',
      });
    });
  });
});
