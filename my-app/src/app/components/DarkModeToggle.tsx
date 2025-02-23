// src/app/components/DarkModeToggle.tsx
"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.classList.remove(
      mode === "light" ? "dark" : "light"
    );
    document.documentElement.classList.add(mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button onClick={toggleMode}>
      Switch to {mode === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
