// src/app/layout.tsx
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export const metadata = {
  title: "Sensor Dashboard",
  description: "Real-time sensor data dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head></head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
