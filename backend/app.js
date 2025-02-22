// app.js
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.post('/update-data', (req, res) => {
    const updatedData = req.body;
    res.json({ status: 'Data updated', data: updatedData });
});

module.exports = app;


//testingok