import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  CircleMarker,
} from "react-leaflet";
import { useMemo, useState } from "react";
import L from "leaflet";

export default function RunMap({ route }) {
  const [dark, setDark] = useState(false);
  if (!route || route.length === 0) return null;

  const positions = useMemo(() => route.map((p) => [p.lat, p.lng]), [route]);

  const start = positions[0];
  const end = positions[positions.length - 1];
  const startIcon = new L.Icon({
    iconUrl: "./startIcon.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  const finishIcon = new L.Icon({
    iconUrl: "./finishIcon.jpg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  return (
    <div className="flex flex-col justify-between items-end">
      <button
        onClick={() => {
          setDark(!dark);
        }}
        className="px-2 bg-amber-400 rounded text-black font-semibold "
      >
        Toggle
      </button>
      <MapContainer
        center={start}
        zoom={19}
        style={{ height: "400px", width: "100%" }}
      >
        {dark ? (
          <TileLayer
            key="dark"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        ) : (
          <TileLayer
            key="satellite"
            attribution="Tiles &copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        <CircleMarker
          center={positions[0]}
          radius={0}
          pathOptions={{ color: "#008000", weight: 12 }}
        />
        <CircleMarker
          center={end}
          radius={0}
          pathOptions={{ color: "#FF0000", weight: 12 }}
        />

        <Polyline
          positions={positions}
          pathOptions={{
            color: dark ? `#c8f135` : `#FBBF24`,
            weight: 5,
          }}
        />
      </MapContainer>
    </div>
  );
}
