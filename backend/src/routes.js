const express = require('express');
const router = express.Router();
const { sensorData, addSensorData } = require('./sensorData');

// GET all sensor data (accessible to both Admin and User)
router.get('/', (req, res) => {
    res.json(sensorData);
});

// POST new sensor data (Admin only)
router.post('/', (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const data = req.body;
    addSensorData(data);
    res.status(201).json({ message: 'Data ingested' });
});

module.exports = router;
