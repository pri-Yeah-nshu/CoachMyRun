import { useContext, useMemo } from "react";
import { RunContext } from "../context/RunProvider";

export default function Records() {
  const { run, loading } = useContext(RunContext);

  const stats = useMemo(() => {
    if (!run || run.length === 0) {
      return {
        totalRuns: 0,
        totalDistance: 0,
        totalDuration: 0,
        avgPace: 0,
      };
    }

    const totalRuns = run.length;

    const totalDistance = run.reduce((acc, r) => acc + (r.distance || 0), 0);

    const totalDuration = run.reduce((acc, r) => acc + (r.duration || 0), 0);

    const avgPace = totalDistance > 0 ? totalDuration / totalDistance : 0;

    return {
      totalRuns,
      totalDistance,
      totalDuration,
      avgPace,
    };
  }, [run]);

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div>
      <h1 className="mt-5 ml-5 pt-3 text-5xl font-extrabold text-slate-100 mb-4">
        Your Records
      </h1>
      <h2 className=" ml-5 pb-3 text-gray-400 mb-8">
        Track your progress and achievements
      </h2>

      <div className="flex justify-between gap-10 m-5">
        {/* Total Runs */}
        <Card icon="🏃" value={stats.totalRuns} label="Total Runs" />

        {/* Total Distance */}
        <Card
          icon="📍"
          value={stats.totalDistance.toFixed(2)}
          unit="km"
          label="Total Distance"
        />

        {/* Total Time */}
        <Card
          icon="⏱️"
          value={formatTime(stats.totalDuration)}
          unit="Hr"
          label="Total Time"
        />

        {/* Avg Pace */}
        <Card
          icon="⚡"
          value={
            stats.avgPace
              ? `${Math.floor(stats.avgPace / 60)}:${Math.floor(
                  stats.avgPace % 60,
                )
                  .toString()
                  .padStart(2, "0")}`
              : "--:--"
          }
          unit="min/km"
          label="Average Pace"
        />
      </div>
    </div>
  );
}

function Card({ icon, value, unit, label }) {
  return (
    <div className="flex flex-col items-start p-4 border-2 text-gray-400 border-gray-700 justify-evenly h-40 w-1/4 bg-gray-800 rounded-2xl hover:border-amber-400 transition duration-300">
      <h1 className="text-2xl">{icon}</h1>
      <h2>
        <span className="text-4xl text-amber-400 font-bold">{value}</span>
        {unit && <span className="text-sm text-gray-400"> {unit}</span>}
      </h2>
      <h3>{label}</h3>
    </div>
  );
}
