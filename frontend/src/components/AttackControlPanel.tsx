import API from "../services/api";

type Props = {
  attack: string;
  setAttack: (value: string) => void;

  intensity: string;
  setIntensity: (value: string) => void;

  packetRate: number;
  setPacketRate: (value: number) => void;

  duration: number;
  setDuration: (value: number) => void;

  target: string;
  setTarget: (value: string) => void;
};

export default function AttackControlPanel({
  attack,
  setAttack,
  intensity,
  setIntensity,
  packetRate,
  setPacketRate,
  duration,
  setDuration,
  target,
  setTarget,
}: Props) {
  // ===========================
  // Launch Attack
  // ===========================
  const launchAttack = async () => {
    try {
      await API.post("/attack/configure", {
        attack,
        target,
        intensity,
        packet_rate: packetRate,
        duration,
      });

      alert(`${attack.toUpperCase()} attack launched successfully.`);
    } catch (err) {
      console.error(err);
      alert("Unable to launch attack. Check FastAPI backend.");
    }
  };

  // ===========================
  // Stop Attack
  // ===========================
  const stopAttack = async () => {
    try {
      switch (attack) {
        case "dos":
          await API.post("/attack/dos/stop");
          break;

        case "spoof":
          await API.post("/attack/spoof/stop");
          break;

        case "replay":
          await API.post("/attack/replay/stop");
          break;

        case "mitm":
          await API.post("/attack/mitm/stop");
          break;

        case "command":
          await API.post("/attack/command/stop");
          break;
      }

      alert("Attack stopped.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">

      <h2 className="text-xl font-semibold text-red-400">
        Advanced Attack Configuration
      </h2>

      {/* Attack Type */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Attack Type
        </label>

        <select
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value="dos">🔥 DoS Flood</option>
          <option value="spoof">🎭 MQTT Spoofing</option>
          <option value="replay">🔁 Replay Attack</option>
          <option value="mitm">🕵 MITM Packet Tampering</option>
          <option value="command">⚠ False Command Injection</option>
        </select>
      </div>

      {/* Attack Intensity */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Attack Intensity
        </label>

        <select
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🟠 High</option>
          <option value="Critical">🔴 Critical</option>
        </select>
      </div>

      {/* Packet Rate */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm text-slate-400">
            Packet Rate
          </label>

          <span className="text-cyan-400 font-semibold">
            {packetRate} packets/sec
          </span>
        </div>

        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={packetRate}
          onChange={(e) => setPacketRate(Number(e.target.value))}
          className="w-full accent-cyan-500"
        />
      </div>

      {/* Attack Duration */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Attack Duration
        </label>

        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value={10}>10 Seconds</option>
          <option value={30}>30 Seconds</option>
          <option value={60}>60 Seconds</option>
          <option value={120}>120 Seconds</option>
          <option value={0}>Continuous</option>
        </select>
      </div>

      {/* Target Device */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Target IoT Device
        </label>

        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value="farm/soil">🌱 Soil Moisture Sensor</option>
          <option value="farm/temperature">🌡 Temperature Sensor</option>
          <option value="farm/humidity">💧 Humidity Sensor</option>
          <option value="farm/light">☀ Light Sensor</option>
          <option value="farm/irrigation">🚰 Irrigation Controller</option>
        </select>
      </div>

      {/* Live Summary */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">

        <h3 className="text-slate-300 font-semibold">
          Live Attack Summary
        </h3>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Attack</span>
          <span className="text-red-400 font-medium">
            {attack.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Intensity</span>
          <span className="text-yellow-400 font-medium">
            {intensity}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Packet Rate</span>
          <span className="text-cyan-400 font-medium">
            {packetRate} pps
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Target</span>
          <span className="text-green-400 font-medium">
            {target}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Duration</span>
          <span className="text-purple-400 font-medium">
            {duration === 0 ? "Continuous" : `${duration} Seconds`}
          </span>
        </div>

      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4">

        <button
          onClick={launchAttack}
          className="bg-red-600 hover:bg-red-500 rounded-lg py-3 font-semibold transition"
        >
          🚀 Launch Attack
        </button>

        <button
          onClick={stopAttack}
          className="bg-slate-700 hover:bg-slate-600 rounded-lg py-3 font-semibold transition"
        >
          🛑 Stop Attack
        </button>

      </div>

    </section>
  );
}