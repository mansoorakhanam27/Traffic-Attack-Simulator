import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  packets: number;
};

export default function TrafficChart({ packets }: Props) {
  const [trafficData, setTrafficData] = useState([
    {
      time: new Date().toLocaleTimeString().slice(3, 8),
      packets,
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrafficData((old) => {
        const updated = [
          ...old,
          {
            time: new Date().toLocaleTimeString().slice(3, 8),
            packets,
          },
        ];

        return updated.slice(-30);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [packets]);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trafficData}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

          <XAxis dataKey="time" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="packets"
            stroke="#22D3EE"
            strokeWidth={3}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}