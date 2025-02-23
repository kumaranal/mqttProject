// src/app/page.tsx
"use client";

import dynamic from "next/dynamic";
import ProtectedRoute from "./components/ProtectedRoute";
import SensorData from "./components/SensorData";
import DarkModeToggle from "./components/DarkModeToggle";

// Dynamically load ChartComponent (client-side only)
const ChartComponent = dynamic(() => import("./components/ChartComponent"), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <main>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Sensor Dashboard</h1>
          <DarkModeToggle />
        </header>
        <section style={{ marginTop: "2rem" }}>
          <SensorData />
        </section>
        <section style={{ marginTop: "2rem" }}>
          <ChartComponent />
        </section>
      </main>
    </ProtectedRoute>
  );
}
