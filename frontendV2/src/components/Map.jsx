import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useContext, useEffect, useState } from "react";
import Loader from "../pages/Loading";
import { AuthContext } from "../context/AuthProvider";
import Clock from "./Clock";
import { usePersistedState } from "../hooks/usePersistedState";
import { io, Socket } from "socket.io-client";
import { useRef } from "react";
function AutoCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position);
    }
  }, [position, map]);
  return null;
}

export default function MapComponent() {
  const socketRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const defaultCenter = [23.1, 75.46];
  const [end, setEnd] = useState(false);
  const [error, setError] = useState("");
  const authData = useContext(AuthContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [runId, setRunId] = usePersistedState("runId", "");
  const [start, setStart] = usePersistedState("start", false);
  const [pause, setPause] = usePersistedState("pause", false);
  const [seconds, setSeconds] = usePersistedState("seconds", 0);
  const [isRunning, setIsRunning] = usePersistedState("isRunning", false);

  function formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  }

  async function handleStart(e) {
    e.preventDefault();
    setButtonLoading(true);
    try {
      const userId = authData.user._id;
      const res = await fetch(`http://localhost:3000/api/v1/run/start`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          userId,
        }),
      });
      if (!res.ok) throw new Error("Something went wrong, please try again...");
      const output = await res.json();
      console.log(output.data.run._id);
      setRunId(output.data.run._id);
      setStart(true);
      setIsRunning(true);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setButtonLoading(false);
    }
  }
  async function handlePause(e) {
    e.preventDefault();
    try {
      const userId = authData.user._id;
      const res = await fetch(
        `http://localhost:3000/api/v1/run/${runId}/pause`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify({
            userId,
          }),
        },
      );
      if (!res.ok) throw new Error("Something went wrong, please try again...");
      const output = await res.json();
      console.log(output);
      setPause(true);
      setIsRunning(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  }
  async function handleResume(e) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/run/${runId}/resume`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Something went wrong, please try again...");
      const output = await res.json();
      console.log(output);
      setIsRunning(true);
      setPause(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  }
  async function handleEnd(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/v1/run/${runId}/end`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: Number(seconds),
        }),
      });
      if (!res.ok) throw new Error("Something went wrong, please try again...");
      const output = await res.json();
      console.log(output);
      setEnd(true);
      setStart(false);
      setPause(false);
      setIsRunning(false);
      setSeconds(0);
      setRunId("");
      setPositions([]);
      ["runId", "start", "pause", "seconds", "isRunning"].forEach((key) =>
        localStorage.removeItem(key),
      );
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  }

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  /* -------------------- SOCKET CONNECTION -------------------- */
  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected:", socketRef.current.id);
    });

    socketRef.current.on("receive-location", (data) => {
      console.log("Received from room:", data);
      setPositions((prev) => {
        const updated = [...prev, [data.latitude, data.longitude]];
        console.log("UPDATED ARRAY:", updated);
        return updated;
      });
      // Optional: if you want to update map from others
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  /* -------------------- JOIN ROOM WHEN RUN STARTS -------------------- */
  useEffect(() => {
    if (runId && socketRef.current) {
      socketRef.current.emit("join-run", runId);
      console.log("run room joined");
    }
  }, [runId]);

  /* -------------------- GEOLOCATION -------------------- */
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // setPositions((prev) => [...prev, [latitude, longitude]]);

        // Only send when run is active
        if (socketRef.current && runId && isRunning) {
          socketRef.current.emit("positions", {
            runId,
            latitude,
            longitude,
          });
        }
        console.log({ runId, latitude, longitude });
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      },
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [runId, isRunning]);

  return (
    <div className="relative">
      {loading && <Loader />}
      {/* Toggle Button */}
      <button
        onClick={() => setToggle(!toggle)}
        className="absolute z-[1000] top-4 right-4 bg-amber-500 px-4 py-2 rounded-xl shadow-lg hover:bg-amber-600 transition"
      >
        {toggle ? "Dark View" : "Satellite View"}
      </button>
      <Clock
        formatTime={formatTime}
        seconds={seconds}
        start={start}
        pause={pause}
      />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] flex gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
        {!start && (
          <button
            onClick={(e) => {
              handleStart(e);
            }}
            className="bg-green-500 px-4 py-2 rounded-xl text-white hover:bg-green-600 transition"
          >
            {buttonLoading ? "Starting..." : "Start"}
          </button>
        )}

        {start && !pause && (
          <button
            onClick={(e) => {
              handlePause(e);
            }}
            className="bg-yellow-500 px-4 py-2 rounded-xl text-white hover:bg-yellow-600 transition"
          >
            Pause
          </button>
        )}

        {start && pause && (
          <button
            onClick={(e) => {
              handleResume(e);
            }}
            className="bg-blue-500 px-4 py-2 rounded-xl text-white hover:bg-blue-600 transition"
          >
            Resume
          </button>
        )}

        {start && (
          <button
            onClick={(e) => {
              handleEnd(e);
            }}
            className="bg-red-500 px-4 py-2 rounded-xl text-white hover:bg-red-600 transition"
          >
            Finish
          </button>
        )}
      </div>
      <MapContainer
        center={defaultCenter}
        zoom={19}
        style={{ height: "500px", width: "100%" }}
      >
        {toggle ? (
          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        ) : (
          <TileLayer
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}
        {positions.length > 0 && (
          <CircleMarker
            center={positions[0]}
            radius={5}
            pathOptions={{ color: "#008000" }}
          />
        )}

        {positions.length > 0 && (
          <CircleMarker
            center={positions[positions.length - 1]}
            radius={5}
            pathOptions={{ color: "#ff0000" }}
          />
        )}
        {positions.length > 0 && (
          <AutoCenter position={positions[positions.length - 1]} />
        )}
        {positions.length > 1 && (
          <Polyline
            key={positions.length}
            positions={positions}
            pathOptions={{
              color: "#FFCA28",
              weight: 6,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
