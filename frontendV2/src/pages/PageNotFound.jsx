import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black gap-4">
      {/* Glowing 404 */}
      <h1
        className="text-red-500 font-black uppercase tracking-widest"
        style={{
          fontSize: "120px",
          lineHeight: 1,
          textShadow: "0 0 20px rgba(300,0,0,0.8), 0 0 60px rgba(300,0,0,0.3)",
        }}
      >
        404
      </h1>

      {/* Divider */}
      <div
        className="w-24 h-0.5 bg-red-500"
        style={{ boxShadow: "0 0 10px rgba(300,0,0,0.8)" }}
      />

      {/* Subtitle */}
      <p className="text-gray-500 uppercase tracking-[6px] text-sm font-semibold">
        Page Not Found
      </p>

      <p className="text-gray-600 text-sm mt-2">
        Looks like you took a wrong turn on your run 🏃
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-md border border-gray-700 text-gray-400 text-sm font-medium hover:border-gray-500 hover:text-white transition-all"
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-md bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-300 transition-all"
          style={{ boxShadow: "0 0 16px rgba(234,179,8,0.5)" }}
        >
          Go to Homepage ⚡
        </button>
      </div>
    </div>
  );
}
