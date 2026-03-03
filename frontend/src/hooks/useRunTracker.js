import { useState, useRef, useEffect } from "react";

export default function useRunTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  const timerRef = useRef(null);

  const start = () => {
    setIsRunning(true);
    setDuration(0);
    setDistance(0);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
      setDistance((prev) => prev + Math.random() * 3);
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return { isRunning, duration, distance, start, stop };
}
