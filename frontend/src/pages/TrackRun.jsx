import useRunTracker from "../hooks/useRunTracker";
import { formatDuration, formatDistance } from "../utils/formatters";

export default function TrackRun() {
  const { isRunning, duration, distance, start, stop } = useRunTracker();

  return (
    <div>
      <h2>Track Run</h2>

      <p>Duration: {formatDuration(duration)}</p>
      <p>Distance: {formatDistance(distance)} km</p>

      {!isRunning ? (
        <button onClick={start}>Start</button>
      ) : (
        <button onClick={stop}>Stop</button>
      )}
    </div>
  );
}
