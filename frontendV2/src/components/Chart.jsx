import { useContext, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { RunContext } from "../context/RunProvider";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Chart() {
  const { run, loading } = useContext(RunContext);
  const [activeMonth, setActiveMonth] = useState(null);

  const data = useMemo(() => {
    if (!run) return [];

    const currentYear = new Date().getFullYear();

    const monthlyData = Array(12).fill(0);

    run.forEach((r) => {
      const date = new Date(r.date);
      if (date.getFullYear() === currentYear && r.status === "end") {
        const monthIndex = date.getMonth();
        monthlyData[monthIndex] += r.distance || 0;
      }
    });

    return months.map((month, index) => ({
      month,
      km: Number(monthlyData[index].toFixed(2)),
    }));
  }, [run]);

  const totalKm = data.reduce((sum, d) => sum + d.km, 0);
  const bestMonth = data.reduce(
    (best, d) => (d.km > best.km ? d : best),
    data[0] || { month: "-", km: 0 },
  );
  const avgKm = totalKm > 0 ? (totalKm / 12).toFixed(1) : 0;

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.month !== activeMonth) return null;
    return (
      <>
        <circle cx={cx} cy={cy} r={10} fill="rgba(251,191,36,0.15)" />
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="#FBBF24"
          stroke="#111318"
          strokeWidth={2}
        />
      </>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#13151c] border border-amber-400 rounded-xl p-3 shadow-lg">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {label} {new Date().getFullYear()}
          </p>
          <p className="text-2xl font-bold text-amber-400">
            {payload[0].value} km
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="flex justify-center m-10 p-5">
      <div className="bg-[#111318] rounded-2xl p-6 border border-[#222] text-white w-full max-w-[800px]">
        {/* Header */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Current year stats
          </p>
          <h2 className="text-xl font-extrabold uppercase tracking-wide">
            Yearly Distance
          </h2>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-7">
          <StatCard label="Monthly Avg" value={`${avgKm} km`} />
          <StatCard
            label="Best Month"
            value={`${bestMonth.month} · ${bestMonth.km} km`}
          />
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={data}
            onMouseMove={(e) => {
              if (e.activePayload)
                setActiveMonth(e.activePayload[0].payload.month);
            }}
            onMouseLeave={() => setActiveMonth(null)}
          >
            <defs>
              <linearGradient id="kmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#1e2028" />

            <ReferenceLine
              y={parseFloat(avgKm)}
              stroke="#444"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#555", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#555", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}km`}
              width={45}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="km"
              stroke="#FBBF24"
              strokeWidth={2.5}
              fill="url(#kmGradient)"
              dot={<CustomDot activeMonth={activeMonth} />}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#1a1d24] rounded-xl p-4 flex-1 border border-[#2a2a2a]">
      <p className="text-xs text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-extrabold text-amber-400 mt-1">{value}</p>
    </div>
  );
}
