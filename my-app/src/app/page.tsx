"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

// Initialize socket connection to your backend (adjust the URL if necessary)
const socket = io("http://localhost:4000");

export default function Home() {
  const [userUpdate, setUserUpdate] = useState(null);
  const [mqttData, setMqttData] = useState(null);

  useEffect(() => {
    // Listen for real-time user update events from the database
    socket.on("userUpdated", (data) => {
      console.log("Received userUpdated:", data);
      setUserUpdate(data);
    });

    // Listen for MQTT messages re-emitted through Socket.IO
    socket.on("mqtt_message", (data) => {
      console.log("Received mqtt_message:", data);
      setMqttData(data);
    });

    // Cleanup listeners on component unmount
    return () => {
      socket.off("userUpdated");
      socket.off("mqtt_message");
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Real-Time Updates</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>User Updates (Database)</h2>
        {userUpdate ? (
          <pre>{JSON.stringify(userUpdate, null, 2)}</pre>
        ) : (
          <p>No user updates received.</p>
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
