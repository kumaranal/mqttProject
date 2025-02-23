// src/app/components/ChartComponent.tsx
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SensorDataType {
  timestamp: string;
  temperature: string;
  humidity: string;
  powerUsage: string;
}

export default function ChartComponent() {
  const [history, setHistory] = useState<SensorDataType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:4000/api/sensors");
        const json = await res.json();
        setHistory(json);
      } catch (error) {
        console.error("Error fetching sensor history", error);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Historical Sensor Data</h2>
      {history.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#8884d8"
              name="Temperature"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#82ca9d"
              name="Humidity"
            />
            <Line
              type="monotone"
              dataKey="powerUsage"
              stroke="#ffc658"
              name="Power Usage"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}
