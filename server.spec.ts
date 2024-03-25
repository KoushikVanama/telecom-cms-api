import request from 'supertest';
import app from './server';

describe('Customer Registration API', () => {
    test('POST /api/customers/register should register a new customer', async () => {
        const newCustomer = {
            name: 'John Doe',
            dob: '1990-01-01',
            email: 'john@example.com',
            aadhaar: 123456789012,
            reg_date: '2022-01-01',
            mobile: 1234567890,
        };
        const response = await request(app)
            .post('/api/customers/register')
            .send(newCustomer);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Customer registered successfully' });
    });

    test('GET /api/customers should return all customers', async () => {
        const response = await request(app).get('/api/customers');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('Plan Assignment API', () => {
    test('POST /api/customers/:customerId/assign-plan should assign a plan to a customer', async () => {
        const customerId = '12345';
        const chosenPlan = {
            name: 'Platinum365',
            cost: 499,
            validity: 365,
            status: 'Active',
        };
        const response = await request(app)
            .post(`/api/customers/${customerId}/assign-plan`)
            .send(chosenPlan);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Plan assigned successfully' });
    });
});

describe('Plan Renewal API', () => {
    test('PATCH /api/customers/:customerId/renew-plan should renew a plan for a customer', async () => {
        const customerId = '12345';
        const renewalData = {
            renewal_date: '2023-01-01',
            planStatus: 'Active',
        };
        const response = await request(app)
            .patch(`/api/customers/${customerId}/renew-plan`)
            .send(renewalData);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Plan renewed successfully' });
    });
});
