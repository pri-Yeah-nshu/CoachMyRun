import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import Loader from "../pages/Loading";
import TryRun from "./TryRun";
import RunMap from "./RunMap";

export default function Profile() {
  const authData = useContext(AuthContext);
  const [run, setRun] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);
  useEffect(() => {
    if (!authData.user) return;

    const fetchRuns = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/v1/run/history", {
          method: "GET",
          credentials: "include",
        });
        const output = await res.json();
        setRun(output.data.runs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [authData.user]);

  if (!authData.user) return null;

  const { name, email, age, gender } = authData.user;

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col gap-8">
      {/* Profile Card */}
      <div
        className="rounded-2xl p-6 flex flex-row items-center gap-6"
        style={{ background: "#111318", border: "1px solid #222" }}
      >
        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-black flex-shrink-0"
          style={{
            background: "#FBBF24",
            boxShadow: "0 0 20px rgba(200,241,53,0.4)",
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1">
          <h2
            className="text-2xl font-black uppercase tracking-widest text-white"
            style={{ textShadow: "0 0 10px rgba(255,255,255,0.1)" }}
          >
            {name}
          </h2>
          <p className="text-gray-500 text-sm">{email}</p>

          <div className="flex gap-3 mt-2">
            {[
              { label: "Age", value: age },
              { label: "Gender", value: gender },
            ].map((item) => (
              <div
                key={item.label}
                className="px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
                style={{
                  background: "#1a1d24",
                  border: "1px solid #2a2a2a",
                  color: "#FBBF24",
                }}
              >
                {item.label}: {item.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Run History */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#111318", border: "1px solid #222" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Run History
          </h3>
          <button
            // onClick={}
            className="text-xs px-4 py-2 rounded-md font-bold uppercase tracking-widest transition-all"
            style={{
              background: "#FBBF24",
              color: "#000",
              boxShadow: "0 0 12px rgba(200,241,53,0.3)",
            }}
          >
            Load Runs
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {loading ? (
          <Loader />
        ) : run.length === 0 ? (
          <TryRun />
        ) : (
          <div className="flex flex-col gap-3">
            {run.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "#1a1d24", border: "1px solid #2a2a2a" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏃</span>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {(() => {
                        const totalSec = r.duration;
                        const hours = String(
                          Math.floor(totalSec / 3600),
                        ).padStart(2, "0");
                        const minutes = String(
                          Math.floor((totalSec % 3600) / 60),
                        ).padStart(2, "0");
                        const second = String(
                          Math.floor(totalSec % 60),
                        ).padStart(2, "0");
                        return `${hours}:${minutes}:${second}`;
                      })()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center ">
                  <p
                    className="font-black text-lg"
                    style={{
                      color: "#FBBF24",
                      textShadow: "0 0 8px rgba(200,241,53,0.5)",
                    }}
                  >
                    {r.distance < 1000
                      ? `${r.distance.toFixed(0)} m`
                      : `${(r.distance / 1000).toFixed(2)} km`}
                  </p>
                  <button
                    onClick={() => setSelectedRun(r)}
                    className="text-xs px-3 py-1 rounded-md font-bold"
                    style={{ background: "#FBBF24", color: "#000" }}
                  >
                    View Map
                  </button>
                </div>
                {selectedRun && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#111318] p-6 rounded-2xl w-[90%] max-w-3xl">
                      <div className="flex justify-between mb-4">
                        <h2 className="text-white font-bold">Run Route</h2>
                        <button
                          onClick={() => setSelectedRun(null)}
                          className="text-red-400"
                        >
                          Close
                        </button>
                      </div>

                      <RunMap route={selectedRun.route} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
