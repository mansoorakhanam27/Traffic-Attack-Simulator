import { useState, useEffect } from "react";
import API from "./services/api";

import DevicePanel from "./components/DevicePanel";
import AttackControlPanel from "./components/AttackControlPanel";
import TrafficChart from "./components/TrafficChart";
import AttackSeverity from "./components/AttackSeverity";

// =====================================
// Statistics Card
// =====================================
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <p className="text-sm text-slate-400">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

// =====================================
// Main Dashboard
// =====================================
export default function App() {
  // Dashboard State
  const [mqttMessages, setMqttMessages] = useState(0);
  const [packets, setPackets] = useState(5);

  // Shared Attack Configuration State
  const [attackType, setAttackType] = useState("dos");
  const [packetRate, setPacketRate] = useState(100);
  const [intensity, setIntensity] = useState("Medium");
  const [duration, setDuration] = useState(30);
  const [targetDevice, setTargetDevice] = useState("farm/soil");

  const [activeAttack, setActiveAttack] = useState("Normal");

  const [eventLog, setEventLog] = useState<string[]>([
    `🟢 Simulator initialized • ${new Date().toLocaleTimeString()}`,
  ]);

  // =====================================
  // Dashboard reacts instantly to slider
  // =====================================
  useEffect(() => {
    setPackets(packetRate);
  }, [packetRate]);

  // =====================================
  // Launch Attack
  // =====================================
  const launchAttack = async (
    attackName: string,
    endpoint: string,
    trafficRate: number
  ) => {
    try {
      await API.post(endpoint);

      setActiveAttack(attackName);
      setPackets(trafficRate);
      setPacketRate(trafficRate);
      setMqttMessages((prev) => prev + 1);

      setEventLog((prev) => [
        `🚨 ${attackName} started on ${targetDevice} • ${new Date().toLocaleTimeString()}`,
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // =====================================
  // Stop All Attacks
  // =====================================
  const stopAllAttacks = async () => {
    try {
      await Promise.all([
        API.post("/attack/spoof/stop"),
        API.post("/attack/replay/stop"),
        API.post("/attack/dos/stop"),
        API.post("/attack/command/stop"),
        API.post("/attack/mitm/stop"),
      ]);

      setActiveAttack("Normal");
      setPackets(5);
      setPacketRate(5);

      setEventLog((prev) => [
        `🛑 All attacks stopped • ${new Date().toLocaleTimeString()}`,
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex justify-between items-center shadow-md">

        <div>
          <h1 className="text-3xl font-bold text-green-400">
            Traffic Attack Simulator
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Real-Time Agricultural IoT Security Testbed
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-full">
          <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-green-400 font-medium">Backend Online</span>
        </div>

      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="p-8 space-y-8">

        {/* ================= NETWORK STATISTICS ================= */}
        <section>
          <h2 className="text-xl font-semibold text-slate-300 mb-5">
            Network Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Packets / Second"
              value={packetRate.toString()}
              color="text-cyan-400"
            />

            <StatCard
              title="MQTT Messages"
              value={mqttMessages.toString()}
              color="text-purple-400"
            />

            <StatCard
              title="Virtual Devices"
              value="5"
              color="text-yellow-400"
            />

            <StatCard
              title="Active Attack"
              value={activeAttack}
              color={
                activeAttack === "Normal"
                  ? "text-green-400"
                  : "text-red-400"
              }
            />

          </div>
        </section>

        {/* ================= ATTACK CONTROL CENTER ================= */}
        <section>
          <h2 className="text-xl font-semibold text-slate-300 mb-5">
            Quick Attack Controls
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

            <button
              onClick={() => launchAttack("MQTT Spoofing", "/attack/spoof/start", 35)}
              className="bg-red-600 hover:bg-red-500 rounded-xl py-4 font-semibold transition"
            >
              MQTT Spoofing
            </button>

            <button
              onClick={() => launchAttack("Replay Attack", "/attack/replay/start", 25)}
              className="bg-orange-600 hover:bg-orange-500 rounded-xl py-4 font-semibold transition"
            >
              Replay Attack
            </button>

            <button
              onClick={() => launchAttack("DoS Flood", "/attack/dos/start?rate=200", 200)}
              className="bg-pink-600 hover:bg-pink-500 rounded-xl py-4 font-semibold transition"
            >
              DoS Flood
            </button>

            <button
              onClick={() => launchAttack("False Command Injection", "/attack/command/start", 18)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl py-4 font-semibold transition"
            >
              False Command Injection
            </button>

            <button
              onClick={() => launchAttack("MITM Packet Tampering", "/attack/mitm/start", 40)}
              className="bg-purple-700 hover:bg-purple-600 rounded-xl py-4 font-semibold transition"
            >
              MITM Packet Tampering
            </button>

            <button
              onClick={stopAllAttacks}
              className="bg-slate-700 hover:bg-slate-600 rounded-xl py-4 font-semibold transition"
            >
              Stop All Attacks
            </button>

          </div>
        </section>

        {/* ================= ADVANCED ATTACK CONFIGURATION ================= */}
        <AttackControlPanel
          attack={attackType}
          setAttack={(value) => {
            setAttackType(value);
            setActiveAttack(value.toUpperCase());
          }}
          intensity={intensity}
          setIntensity={setIntensity}
          packetRate={packetRate}
          setPacketRate={setPacketRate}
          duration={duration}
          setDuration={setDuration}
          target={targetDevice}
          setTarget={setTargetDevice}
        />

        {/* ================= LIVE TRAFFIC + SEVERITY ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-slate-300">
                Live Traffic Monitor
              </h2>

              <span className="text-green-400 text-sm">
                ● MQTT Streaming Active
              </span>
            </div>

            <TrafficChart packets={packetRate} />

            <div className="mt-6 flex justify-between items-center">

              <div>
                <p className="text-slate-400 text-sm">Current Traffic</p>

                <h1 className="text-5xl font-bold text-cyan-400 mt-1">
                  {packetRate}
                </h1>

                <p className="text-slate-500 text-sm">Packets / Second</p>
              </div>

              <div className="w-56">

                <div className="bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-3 transition-all duration-500"
                    style={{
                      width: `${Math.min((packetRate / 300) * 100, 100)}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Network Utilization
                </p>

              </div>

            </div>

          </div>

          {/* Severity Card */}
          <AttackSeverity packets={packetRate} />

        </section>

        {/* ================= DEVICE PANEL ================= */}
        <DevicePanel />

        {/* ================= ATTACK TIMELINE ================= */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-slate-300">
              Attack Timeline
            </h2>

            <span className="text-sm text-slate-500">
              Latest Events
            </span>
          </div>

          <div className="h-72 overflow-y-auto space-y-3">

            {eventLog.map((event, index) => (
              <div
                key={index}
                className="border-b border-slate-800 pb-3 text-sm text-slate-300"
              >
                {event}
              </div>
            ))}

          </div>

        </section>

      </main>
    </div>
  );
}