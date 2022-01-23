/* eslint-disable jest/no-export */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-unresolved */
import request from 'supertest';
import dotenv from 'dotenv-safe';
import app from '../app';

dotenv.config();

const existingEmployeeData = {
  name: 'Odinaka Joy',
  email: 'dinakajoy@gmail.com',
  phone: '08027878998',
  gender: 'male',
  role: '8150',
  department: 'administration',
  createdBy: 'administration',
  updatedBy: 'admin',
  street: '#3 Rumudara',
  town: 'Obigbo',
  state: 'Rivers',
  country: 'Nigeria',
};

const newEmployeeData = {
  name: 'Atu Prosper',
  email: 'atu.prosper@gmail.com',
  phone: '08027878998',
  gender: 'male',
  role: '6594',
  department: 'administration',
  createdBy: 'administration',
  updatedBy: 'admin',
  street: '#3 Rumudara',
  town: 'Obigbo',
  state: 'Rivers',
  country: 'Nigeria',
};

let id = '';
export default id;

describe('employee', () => {
  // employee registration
  describe('employee registration', () => {
    describe('given that you are not authenticated', () => {
      it('should return an unauthenticated error', async () => {
        const { statusCode, body } = await request(app)
          .post('/api/employees')
          .set('Accept', 'application/json')
          .send(newEmployeeData);

        expect(statusCode).toBe(403);
        expect(body).toMatchObject({
          errors: 'Please login or create an account',
          status: 'error',
        });
      });
    });

    describe('given that you are logged in as with an expired or invalid token', () => {
      it('should return an unauthorized error', async () => {
        const { statusCode } = await request(app)
          .post('/api/employees')
          .set('Accept', 'application/json')
          .set('authorization', process.env.WRONG_JWT_DATA || '')
          .send(newEmployeeData);

        expect(statusCode).toBe(500);
      });
    });

    describe('given the email has been registered', () => {
      it('should return an error', async () => {
        const { statusCode, body } = await request(app)
          .post('/api/employees')
          .set('Accept', 'application/json')
          .set('authorization', process.env.JWT_DATA || '')
          .send(existingEmployeeData);

        expect(statusCode).toBe(400);
        expect(body).toEqual({
          status: 'error',
          errors: 'Employee already exist',
        });
      });
    });

    describe('given the email has not been registered', () => {
      it('should return the employee payload', async () => {
        try {
          const { statusCode, body } = await request(app)
            .post('/api/employees')
            .set('Accept', 'application/json')
            .set('authorization', process.env.JWT_DATA || '')
            .send(newEmployeeData);

          id = body.payload.id;

          expect(statusCode).toBe(201);
        } catch (e) {
          expect(e).toMatch('error');
        }
      });
    });
  });

  // get all employees
  describe('given that you want to view all employees', () => {
    it('should return all registered employees payload', async () => {
      const { statusCode } = await request(app).get('/api/employees');

      expect(statusCode).toBe(200);
    });
  });

  // get single employees
  describe('given that you want to view a particular employee', () => {
    it('should return employee with the below id', async () => {
      const { statusCode } = await request(app).get(`/api/employees/${id}`);

      expect(statusCode).toBe(200);
    });
  });

  // update single employees
  describe('given that you want to update a particular employee', () => {
    it('should update and return employee with the below id', async () => {
      const { statusCode, body } = await request(app)
        .put(`/api/employees/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '')
        .send(newEmployeeData);

      expect(statusCode).toBe(200);
      expect(body.message).toEqual('Employee updated successfully 🚀');
    });
  });

  // delete single employees
  describe('given that you want to delete a particular employee', () => {
    it('should delete employee with the below id', async () => {
      const { statusCode, body } = await request(app)
        .delete(`/api/employees/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', process.env.JWT_DATA || '');

      id = '';
      expect(statusCode).toBe(200);
      expect(body).toEqual({
        status: 'success',
        message: 'Employee deleted successfully 🚀',
      });
    });
  });
});
