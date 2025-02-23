// src/app/components/SensorData.tsx
"use client";

import { useState, useEffect } from "react";

interface SensorDataType {
  timestamp: string;
  temperature: string;
  humidity: string;
  powerUsage: string;
}

export default function SensorData() {
  const [data, setData] = useState<SensorDataType | null>(null);

  useEffect(() => {
    // Update the WebSocket URL as needed
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const sensor: SensorDataType = JSON.parse(event.data);
        setData(sensor);
      } catch (error) {
        console.error("Error parsing sensor data", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h2>Real-time Sensor Data</h2>
      {data ? (
        <ul>
          <li>Temperature: {data.temperature}</li>
          <li>Humidity: {data.humidity}</li>
          <li>Power Usage: {data.powerUsage}</li>
          <li>Timestamp: {new Date(data.timestamp).toLocaleString()}</li>
        </ul>
      ) : (
        <p>Loading sensor data...</p>
      )}
    </div>
  );
}
