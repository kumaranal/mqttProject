const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type SensorData {
    timestamp: String
    temperature: String
    humidity: String
    powerUsage: String
  }

  type Query {
    sensorData: [SensorData]
  }

  type Mutation {
    addSensorData(temperature: String, humidity: String, powerUsage: String): SensorData
  }
`;

const resolvers = {
    Query: {
        sensorData: (_, __, { sensorData }) => sensorData,
    },
    Mutation: {
        addSensorData: (_, args, { user, sensorData }) => {
            if (!user || user.role !== 'admin') {
                throw new Error('Forbidden: Admins only');
            }
            const data = {
                timestamp: new Date().toISOString(),
                temperature: args.temperature,
                humidity: args.humidity,
                powerUsage: args.powerUsage,
            };
            sensorData.push(data);
            return data;
        },
    },
};

module.exports = { typeDefs, resolvers };
