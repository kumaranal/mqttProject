// tests/api.test.js
const request = require('supertest');
const app = require('../app'); // Import the Express app

describe('Express API', () => {
    test('GET / should return welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello from Express!');
    });

    test('POST /update-data should return updated data', async () => {
        const sampleData = { key: 'value' };
        const response = await request(app)
            .post('/update-data')
            .send(sampleData)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', 'Data updated');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(sampleData);
    });
});
