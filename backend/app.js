// app.js or a dedicated route file
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.post('/update-data', (req, res) => {
    const updatedData = req.body;
    res.json({ status: 'Data updated', data: updatedData });
});

// GET API endpoint to fetch all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while retrieving data.' });
    }
});

// POST API endpoint to update a user and emit a Socket.IO event
app.post('/api/users/update', async (req, res) => {
    try {
        const { id, ...data } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
        });

        // Emit the event to all connected clients
        // Ensure that you have access to your Socket.IO instance (see note below)
        // Retrieve the Socket.IO instance from the app locals and emit an event
        const io = req.app.get('socketio');
        if (io) {
            io.emit('userUpdated', updatedUser);
        } else {
            console.error("Socket.IO instance not found");
        }
        res.json({ status: 'User updated', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = app;
