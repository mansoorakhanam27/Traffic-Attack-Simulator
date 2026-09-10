type Props = {
  packets: number;
};

export default function AttackSeverity({ packets }: Props) {
  let label = "Normal";
  let color = "bg-green-500";

  if (packets > 50 && packets <= 120) {
    label = "Medium";
    color = "bg-yellow-500";
  }

  if (packets > 120 && packets <= 250) {
    label = "High";
    color = "bg-orange-500";
  }

  if (packets > 250) {
    label = "Critical";
    color = "bg-red-600";
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg">
      <p className="text-slate-400 text-sm">Threat Severity</p>

      <div className="flex items-center gap-3 mt-4">
        <div className={`w-4 h-4 rounded-full ${color}`}></div>

        <h2 className="text-2xl font-bold text-white">{label}</h2>
      </div>

      <p className="text-slate-500 mt-2 text-sm">
        {packets} packets/sec detected.
      </p>
    </div>
  );
}