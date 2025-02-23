const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sensorRoutes = require('../src/routes');
const { sensorData } = require('../src/sensorData');

// Set up an Express app for testing
const app = express();
app.use(bodyParser.json());

// Mock authentication middleware: always sets user as Admin
app.use((req, res, next) => {
    req.user = { role: 'admin' };
    next();
});
app.use('/api/sensors', sensorRoutes);

describe('Sensor API', () => {
    beforeEach(() => {
        // Clear sensor data before each test
        sensorData.length = 0;
    });

    it('should ingest sensor data with POST', async () => {
        const data = {
            temperature: "25.00",
            humidity: "50.00",
            powerUsage: "120.00"
        };
        const response = await request(app).post('/api/sensors').send(data);
        expect(response.statusCode).toBe(201);
        expect(sensorData).toHaveLength(1);
    });

    it('should fetch sensor data with GET', async () => {
        sensorData.push({
            timestamp: new Date().toISOString(),
            temperature: "25.00",
            humidity: "50.00",
            powerUsage: "120.00"
        });
        const response = await request(app).get('/api/sensors');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });
});
