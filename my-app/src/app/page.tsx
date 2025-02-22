"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

// Initialize socket connection to your backend (adjust the URL if necessary)
const socket = io("http://localhost:4000");

export default function Home() {
  const [dbData, setDbData] = useState(null);
  const [mqttData, setMqttData] = useState(null);

  useEffect(() => {
    // Listen for real-time database update events
    socket.on("dbUpdate", (data) => {
      console.log("Received dbUpdate:", data);
      setDbData(data);
    });

    // Listen for MQTT messages that are re-emitted through Socket.IO
    socket.on("mqttMessage", (data) => {
      console.log("Received mqttMessage:", data);
      setMqttData(data);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("dbUpdate");
      socket.off("mqttMessage");
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Real-Time Updates</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Database Updates</h2>
        {dbData ? (
          <pre>{JSON.stringify(dbData, null, 2)}</pre>
        ) : (
          <p>No database updates received.</p>
        )}
      </section>

      <section>
        <h2>MQTT Messages</h2>
        {mqttData ? (
          <pre>{JSON.stringify(mqttData, null, 2)}</pre>
        ) : (
          <p>No MQTT messages received.</p>
        )}
      </section>
    </div>
  );
}

///details
