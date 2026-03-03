export const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const formatDistance = (meters) => {
  return (meters / 1000).toFixed(2);
};

export const formatPace = (minPerKm) => {
  if (!minPerKm) return "--:--";
  const min = Math.floor(minPerKm);
  const sec = Math.round((minPerKm - min) * 60);
  return `${min}:${String(sec).padStart(2, "0")}`;
};
