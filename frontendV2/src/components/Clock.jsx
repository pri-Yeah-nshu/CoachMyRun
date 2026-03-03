export default function Clock({ formatTime, seconds, start, pause }) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
      <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-white/20">
        <p className="text-3xl font-mono tracking-widest text-white">
          {formatTime(seconds)}
        </p>
        <p className="text-xs text-gray-300 text-center">
          {start ? (pause ? "Paused" : "Running") : "Ready"}
        </p>
      </div>
    </div>
  );
}
