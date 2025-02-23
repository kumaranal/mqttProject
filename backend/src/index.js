const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const { WebSocketServer } = require('ws');
const mqtt = require('mqtt');

const sensorRoutes = require('./routes');
const { typeDefs, resolvers } = require('./graphql');
const { sensorData, addSensorData } = require('./sensorData');
const { authenticateJWT } = require('./auth');
const cors = require('cors');

const PORT = process.env.PORT || 4000;

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// JWT Authentication middleware – sets req.user if a valid token is provided
app.use(authenticateJWT);

// REST API endpoints for sensor data
app.use('/api/sensors', sensorRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.send('OK'));

// Create HTTP server to use with both Express and WebSocket
const server = http.createServer(app);

// Set up Apollo Server for GraphQL API
async function startApolloServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({
            user: req.user,   // pass authenticated user info
            sensorData       // pass sensor data array to GraphQL resolvers
        })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
}
startApolloServer();

// Set up WebSocket server for real-time updates
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
});

// Helper: Broadcast data to all connected WebSocket clients
function broadcastData(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Mock sensor data generator (runs every 5 seconds)
function generateSensorData() {
    const data = {
        timestamp: new Date(),
        temperature: (20 + Math.random() * 10).toFixed(2),
        humidity: (40 + Math.random() * 20).toFixed(2),
        powerUsage: (100 + Math.random() * 50).toFixed(2)
    };
    addSensorData(data);      // store the new sensor data
    broadcastData(data);      // push the new data to WebSocket clients
}
setInterval(generateSensorData, 5000); // simulate sensor data every 5 seconds


// // --- MQTT Integration Start ---

// // Connect to the MQTT broker (update URL as needed)
// const mqttClient = mqtt.connect('mqtt://localhost:1883');

// mqttClient.on('connect', () => {
//     console.log('Connected to MQTT broker');
//     // Subscribe to the sensor data topic
//     mqttClient.subscribe('sensor/data', (err) => {
//         if (err) {
//             console.error('Failed to subscribe to sensor/data', err);
//         } else {
//             console.log('Subscribed to sensor/data topic');
//         }
//     });
// });

// mqttClient.on('message', (topic, message) => {
//     if (topic === 'sensor/data') {
//         try {
//             // Parse incoming message and store sensor data
//             const data = JSON.parse(message.toString());
//             addSensorData(data);
//             broadcastData(data);
//             console.log('Sensor data ingested via MQTT:', data);
//         } catch (error) {
//             console.error('Error parsing MQTT message:', error);
//         }
//     }
// });

// // --- MQTT Simulation (Optional) ---
// // For simulation purposes, publish sensor data to the MQTT broker every 5 seconds.
// // In a real scenario, your sensor devices (or a separate simulation script) would publish this data.
// function simulateSensorData() {
//     const data = {
//         timestamp: new Date(),
//         temperature: (20 + Math.random() * 10).toFixed(2),
//         humidity: (40 + Math.random() * 20).toFixed(2),
//         powerUsage: (100 + Math.random() * 50).toFixed(2)
//     };
//     // Publish the simulated data
//     mqttClient.publish('sensor/data', JSON.stringify(data));
// }
// setInterval(simulateSensorData, 5000);

// // --- MQTT Integration End ---


// Start the HTTP server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`GraphQL endpoint at http://localhost:${PORT}/graphql`);
});
