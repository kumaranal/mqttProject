// server.js
const http = require('http');
const app = require('./app');
const socketIo = require('socket.io');
const mqtt = require('mqtt');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', // Your Next.js app URL
        methods: ['GET', 'POST']
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

// --- MQTT Integration ---
const mqttBrokerUrl = 'mqtt://broker.hivemq.com'; // Replace with your broker if needed
const mqttClient = mqtt.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Subscribe to a topic (replace 'some/topic' with your desired topic)
    mqttClient.subscribe('some/topic', (err) => {
        if (!err) {
            console.log('Subscribed to some/topic');
        } else {
            console.error('Failed to subscribe:', err);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    // Convert the Buffer to a string
    const msg = message.toString();
    console.log(`Received MQTT message on topic ${topic}: ${msg}`);

    // Forward the MQTT message to all connected Socket.IO clients
    io.emit('mqtt_message', { topic, message: msg });
});

// Optional: Publish MQTT messages from an Express endpoint
// You can add this route in app.js or here. For illustration, here's how to add it:
app.post('/publish-mqtt', (req, res) => {
    const { topic, message } = req.body;
    mqttClient.publish(topic, message, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to publish message' });
        }
        res.json({ status: 'Message published', topic, message });
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
