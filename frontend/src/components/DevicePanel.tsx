import { useEffect, useState } from "react";

type Device = {
  name: string;
  topic: string;
  value: string;
  status: "Online" | "Offline";
};

export default function DevicePanel() {
  const [devices, setDevices] = useState<Device[]>([
    {
      name: "🌱 Soil Moisture Sensor",
      topic: "farm/soil",
      value: "42 %",
      status: "Online",
    },
    {
      name: "🌡 Temperature Sensor",
      topic: "farm/temperature",
      value: "29.5 °C",
      status: "Online",
    },
    {
      name: "💧 Humidity Sensor",
      topic: "farm/humidity",
      value: "64 %",
      status: "Online",
    },
    {
      name: "☀️ Light Sensor",
      topic: "farm/light",
      value: "780 Lux",
      status: "Online",
    },
    {
      name: "🚰 Irrigation Controller",
      topic: "farm/irrigation",
      value: "OFF",
      status: "Online",
    },
  ]);

  // Simulate changing sensor values every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((device) => {
          switch (device.topic) {
            case "farm/soil":
              return {
                ...device,
                value: `${35 + Math.floor(Math.random() * 20)} %`,
              };

            case "farm/temperature":
              return {
                ...device,
                value: `${(26 + Math.random() * 8).toFixed(1)} °C`,
              };

            case "farm/humidity":
              return {
                ...device,
                value: `${55 + Math.floor(Math.random() * 20)} %`,
              };

            case "farm/light":
              return {
                ...device,
                value: `${300 + Math.floor(Math.random() * 700)} Lux`,
              };

            case "farm/irrigation":
              return {
                ...device,
                value: Math.random() > 0.5 ? "ON" : "OFF",
              };

            default:
              return device;
          }
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-green-400">
          Virtual IoT Devices
        </h2>

        <span className="text-green-400 text-sm">● MQTT Active</span>
      </div>

      <div className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.topic}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-green-500 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white">{device.name}</h3>

                <p className="text-xs text-slate-400 mt-1">
                  MQTT Topic: {device.topic}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-green-600 text-white">
                {device.status}
              </span>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-slate-400 text-sm">Current Reading</p>

              <span className="text-lg font-bold text-cyan-400">
                {device.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}