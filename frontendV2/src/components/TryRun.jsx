import { useNavigate } from "react-router-dom";

export default function TryRun() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-8">
      {/* Illustration placeholder */}
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
        style={{
          background: "rgba(200,241,53,0.08)",
          border: "2px dashed rgba(200,241,53,0.3)",
          boxShadow: "0 0 30px rgba(200,241,53,0.08)",
        }}
      >
        🏃
      </div>

      {/* Text */}
      <div className="text-center flex flex-col gap-2">
        <h2
          className="text-white font-black uppercase tracking-widest text-2xl"
          style={{ textShadow: "0 0 20px rgba(255,255,255,0.1)" }}
        >
          No Runs Yet
        </h2>
        <p className="text-gray-500 text-sm tracking-wide">
          Lace up and log your first run to get started
        </p>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate("/map")}
        className="mt-2 px-8 py-3 font-bold text-black text-sm uppercase tracking-widest rounded-md transition-all duration-200 hover:scale-105"
        style={{
          background: " #ffd230",
          boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)",
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = "0 0 30px rgba(251, 191, 36, 0.7)";
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = "0 0 20px rgba(251, 191, 36, 0.4)";
        }}
      >
        ⚡ Try Your First Run
      </button>
    </div>
  );
}
